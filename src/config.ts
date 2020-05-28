export interface IChuckIfcConfig {
    blenderPath: string;
}

const config: IChuckIfcConfig = {
    blenderPath: process.env.CHUCK_BLENDER_BLENDERPATH || 'blender'
};

export default config;
