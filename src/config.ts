export interface IChuckIfcConfig {
    ifcConvertPath: string;
}

const config: IChuckIfcConfig = {
    ifcConvertPath: process.env.CHUCK_IFC_IFCCONVERTPATH || 'IfcConvert'
};

export default config;
