declare module "halyard.js"
{
    const e: typeof Halyard;
    export = e;    
}

declare class Halyard {
    public constructor();

    /**
     * 
     * @param defaultSetStatements 
     * @param preservePreviouslyEnteredValues 
     */
    setDefaultSetStatements(defaultSetStatements, preservePreviouslyEnteredValues?):void;

    /**
     * 
     * @param table 
     */
    addTable(table: any):void;

    /**
     * 
     * @param connection 
     * @param tableOptions 
     */
    addTable(connection: any, tableOptions?: any):void;

    /**
     * 
     * @param hyperCube 
     */
    addHyperCube(hyperCube:any):void;

    /**
     * 
     * @param item 
     */
    addItem(item: any):void;

    /**
     * Retrieves the script representation of the items added to halyard.js.
     * The script returned can be set to QIX Engine using the setScript(script) method.
     */
    getScript():string;

    /**
     * Returns an array of QIX connections that needs to be created before the doReload() method is called.
     * To create connections, use the createConnection(connection) method.
     */
    getQixConnections():[any];

    /**
     * Returns the item that generated the script block at the specified character position from the getScript() call.
     * The main usage for this method is to identify what item that causes a reload failure.
     * @param charPosition 
     */
    getItemThatGeneratedScriptAt(charPosition:number):any;

}

declare namespace Halyard {
   class HyperCube {

    /**
     * A hyper cube is the representation of a hyper cube layout made up by a table/tables.
     * If the hyper cube layout contains dual fields each dual field will have a map table associated.
     * 
     * let hyperCube = new Halyard.HyperCube(qHyperCube, "Car Makers");
 


     * @param hyperCubeLayout - The first parameter is the hyper cube layout
     *                          The hyper cube layout needs to have data in qDataPages.
     *                          Only hyper cubes with qMode equals S for DATA_MODE_STRAIGHT is supported. Example qHyperCube
     * @param options - second parameter is the options JSON or the hyper cube name.
     *                  Optional parameter. Can be either the hyper cube name as a String, or the following structure:
     *                  Property 	Type 	Description
     *                  name 	String 	The name of the table
     *                  section 	String 	The name of the script section. If left empty the script is appended to the previous script section
     */
    constructor(hyperCubeLayout:any, options?: string | any);

    /**
     * Returns the items (Halyard.Table) needed to load the hyper cube layout and the options provided.
     */
    getItems(): [any];
   }
}
