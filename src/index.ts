import { IConversion, IDownloadAssetsStepsContext, IStepDescription, ProgressFn } from '@mitm/chuck';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import config from './config';

export interface IExecBlenderStepsContext extends IDownloadAssetsStepsContext {
    convertedAssetsDir: string;
}

export function describe(): IStepDescription {
    return {
        code: 'exec-blender',
        name: 'Execute Blender to convert STEP files into FBX files',
        priority: 11, // after assets download
    };
}

/**
 * The predicate to process only STEP/STP files
 * @param path
 */
function isStep(path: string) {
    const lowerCasePath = path.toLowerCase();
    return lowerCasePath.endsWith('.step') || lowerCasePath.endsWith('.stp');
}

export function shouldProcess(conv: IConversion, context: IExecBlenderStepsContext) {
    console.log(context, context.assetsPaths.some(isStep));
    return context.assetsPaths &&
        context.assetsPaths.length &&
        context.assetsPaths.some(isStep);
}

export async function process(conv: IConversion, context: IExecBlenderStepsContext, progress: ProgressFn): Promise<void> {
    //=> Create a temporary folder for the assets
    const tmpDir = path.resolve(`${os.tmpdir()}/chuck/exec-blender-${Date.now()}`);
    await fs.mkdirp(tmpDir);

    context.convertedAssetsDir = tmpDir;
    const convertOptions = conv.conversionOptions;

    //=> Execute each conversion sequentially
    // @todo If Blender is mono-threaded, we could make it concurrent
    for (const assetPath of context.assetsPaths) {
        if (isStep(assetPath)) {
            await progress('convert-start', `Converting "${assetPath}" from STEP to FBX`);
            await convertAndStoreAssets(convertOptions, context, assetPath);
        }
    }
}

export async function cleanup(context: IExecBlenderStepsContext): Promise<void> {
    await fs.remove(context.convertedAssetsDir);
}

async function convertAndStoreAssets(
    convertOptions: string[],
    context: IExecBlenderStepsContext,
    stepFilePath: string
): Promise<string> {
    const fbxFileName = path.parse(stepFilePath).name + '.fbx';
    const fbxFilePath = path.resolve(`${context.convertedAssetsDir}/${fbxFileName}`);

    // Expected command:
    // blender -b --python .\step_to_fbx.py --python-exit-code 1 -- "path/file.stp" "path/file.fbx"
    const spawnArgs = [
        '-b',
        '--python', path.join(__dirname, '..', 'src', 'convert.py').toString(),
        '--python-exit-code', '1',
        '--',
        stepFilePath,
        fbxFilePath].concat(convertOptions);

    const converterProcess = spawn(config.blenderPath, spawnArgs);

    //=> Watch process' stdout to log in real time, and keep the complete output in case of crash
    let stdoutAggregator = '';

    converterProcess.stdout.on('data', data => stdoutAggregator += data.toString());
    converterProcess.stderr.on('data', data => stdoutAggregator += data.toString());

    return new Promise<string>((resolve, reject) => {
        //=> Catch error events (such as ENOENT) and reject if one is catched
        converterProcess.on('error', reject);

        //=> Watch for the process to terminate, check return code
        converterProcess.once('close', (code) => {
            if (code !== 0) {
                const message = `Conversion of STEP file ${path.basename(stepFilePath)} to FBX has failed!`;
                return reject(new BlenderCrashError(message, stdoutAggregator));
            }

            const index = context.assetsPaths.findIndex(path => path === stepFilePath);
            context.assetsPaths[index] = fbxFilePath;

            resolve(fbxFilePath);
        });
    });
}

export class BlenderCrashError extends Error {
    constructor(message: string, public readonly BlenderLog: string) {
        super(message);

        Object.setPrototypeOf(this, BlenderCrashError.prototype);
    }
}
