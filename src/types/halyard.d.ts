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

   class Table {
    
        /**
         * A table is the representation of a table/flatfil from a data source.
         * 
         * let table = new Halyard.Table(JSON.parse(data), "Car Makers");
     
    
    
         * @param connection - The first parameter is the data source, and the second parameter is the options JSON or the table name.
         *                     The connection parameter can be implicitly created by providing the data/path/url to the source that should be loaded.
         * @param options - second parameter is the options JSON or the table name.
         *                  Optional parameter. Can be either the table name as a String, or the following structure:
         *                  Property	Type	        Description
         *                  name	    String	        The name of the table
         *                  prefix	    String	        The script prefix function to be used before the load statement
         *                  fields	    Array of Fields	See Field definition below. If no fields are specified then all will be loaded from the source's first table or if specified from srcTable.
         *                  delimiter	String	        The character that delimits a CSV file
         *                  headerRowNr	Number	        The location of the header row
         *                  srcTable	String	        The name of the table in the source file. IE: this could be the sheet name in XLSX.
         *                  section	    String	        The name of the script section. If left empty the script is appended to the previous script section
         */
        constructor(connection: string, options?: string | any);
    
        /**
         * Returns the script needed to load the table based on the connection and the options provided.
         */
        getScript(): [any];

        /**
         * Returns the connection used in the table.
         */
        getFieldList(): [any];
       }
}
