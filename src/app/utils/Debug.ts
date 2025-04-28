import GUI from 'lil-gui'

export default class Debug {
    
    public gui = new GUI()
    // TODO: maybe make debugObject an interface?
    public debugObject = {
        addCube: () => {},
        addRectangle: () => {}
    }

    public constructor() {
    }
}