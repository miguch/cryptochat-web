

declare namespace blockies {
    function create(config?: blockies.BlockiesConfig): HTMLCanvasElement
    interface BlockiesConfig {
        size?: number;
        scale?: number;
        seed?: string;
        color?: string;
        bgcolor?: string;
        spotcolor?: string;
    }
}

export = blockies;