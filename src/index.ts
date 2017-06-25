import { IConversion, IDownloadAssetsStepsContext, IStepDescription, ProgressFn } from '@mitm/chuck';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import config from './config';

export interface IExecIfcStepsContext extends IDownloadAssetsStepsContext {
    convertedAssetsDir: string;
}

export function describe(): IStepDescription {
    return {
        code: 'exec-ifcopenshell',
        name: 'Execute IfcOpenShell to convert IFC files into Collada files',
        priority: 11, // after assets download
    };
}

export function shouldProcess(conv: IConversion, context: IExecIfcStepsContext) {
    return context.assetsPaths &&
        context.assetsPaths.length &&
        context.assetsPaths.some(assetPath => assetPath.toLowerCase().endsWith('.ifc'));
}

export async function process(conv: IConversion, context: IExecIfcStepsContext, progress: ProgressFn): Promise<void> {
    //=> Create a temporary folder for the assets
    const tmpDir = path.resolve(`${os.tmpdir()}/chuck/exec-ifcopenshell-${Date.now()}`);
    await fs.mkdirp(tmpDir);

    context.convertedAssetsDir = tmpDir;
    const convertOptions = conv.conversionOptions;

    //=> Execute each conversion sequentially
    // @todo If IfcConvert is mono-threaded, we could make it concurrent
    for (const assetPath of context.assetsPaths) {
        if (assetPath.toLowerCase().endsWith('.ifc')) {
            await progress('convert-start', `Converting "${assetPath}" from IFC to Collada`);
            await convertAndStoreAssets(convertOptions, context, assetPath);
        }
    }
}

export async function cleanup(context: IExecIfcStepsContext): Promise<void> {
    await fs.remove(context.convertedAssetsDir);
}

async function convertAndStoreAssets(
    convertOptions: string[],
    context: IExecIfcStepsContext,
    ifcFilePath: string
): Promise<string> {
    const colladaFileName = path.parse(ifcFilePath).name + '.dae';
    const colladaFilePath = path.resolve(`${context.convertedAssetsDir}/${colladaFileName}`);

    const spawnArgs = [ifcFilePath, colladaFilePath, '-y'].concat(convertOptions);

    const converterProcess = spawn(config.ifcConvertPath, spawnArgs);

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
                const message = `Conversion of IFC file ${path.basename(ifcFilePath)} to Collada has failed!`;
                return reject(new IfcConvertCrashError(message, stdoutAggregator));
            }

            const index = context.assetsPaths.findIndex(path => path === ifcFilePath);
            context.assetsPaths[index] = colladaFilePath;

            resolve(colladaFilePath);
        });
    });
}

export class IfcConvertCrashError extends Error {
    constructor(message: string, public readonly ifcConvertLog: string) {
        super(message);

        Object.setPrototypeOf(this, IfcConvertCrashError.prototype);
    }
}
