declare module "enigma.js"
{
    const e: enigmaJS.enigma;
    export = e;
}

declare namespace enigmaJS {

type MixinType ="Doc"| "GenericObject"| "GenericBookmark" | string;

    interface IMixin {
        /**
         * QIX Engine types like for example GenericObject, Doc, GenericBookmark, are supported but also custom GenericObject
         * types such as barchart, story and myCustomType.
         * An API will get both their generic type as well as custom type mixins applied.
         */
        types:[MixinType];

        init(args:{config: any, api: IGeneratedAPI});

        /**
         * mixin.extend is an object containing methods to extend the generated API with. These method names cannot already exist or enigma.js will throw an error.
         */
        extend?:[any];

        /**
         * mixin.override is an object containing methods that overrides existing API methods.
         * These method names needs to exist already* or engima.js will throw an error. 
         * Be careful when overriding, you may break expected behaviors in other mixins or your application.
         * base is a reference to the previous mixin method, can be used to invoke the mixin chain before this mixin method.
         */
        override?:[any];
    }

    interface IProtocol {
        //Set to false to disable the use of the bandwidth-reducing delta protocol.
        delta?:boolean;
    }

    /**
     * This section describes the configuration object that is sent into enigma.create(config).
     */
    interface IConfig {
        /**
         * Object containing the specification for the API to generate. Corresponds to a specific version of the QIX Engine API.
         */
        schema:object;
        /**
         * String containing a proper websocket URL to QIX Engine.
         */
        url: string;
        /**
         * A function to use when instantiating the WebSocket, mandatory for Node.js.
         */
        createSocket?:any;
        /**
         * ES6-compatible Promise library.
         */
        Promise?: any;
        /**
         * Set to true if the session should be suspended instead of closed when the websocket is closed.
         */
        suspendOnClose?: boolean;
        /**
         * Mixins to extend/augment the QIX Engine API.
         * See Mixins section for more information how each entry in this array should look like.
         * Mixins are applied in the array order.
         */
        mixins?:[any];
        /**
         * Interceptors for augmenting responses before they are passed into mixins and end-users.
         * See Interceptors section for more information how each entry in this array should look like.
         * Interceptors are applied in the array order.
         */
        interceptors?:[any];
        /**
         * An object containing additional JSON-RPC request parameters.
         * protocol.delta :  Set to false to disable the use of the bandwidth-reducing delta protocol.
         */
        protocol?:any;
      
    }

    interface enigma {
        /**
         * Create a session object.
         * @returns {ISession} - Returns a session.
         * Note: See Configuration for the configuration options.      
         */
        create(congfig: IConfig): ISession;
    }

    interface ISession {
        /**
         * Establishes the websocket against the configured URL. Eventually resolved with the QIX global interface when the connection has been established.
         * @return Promise.
         */
        open():Promise<IGeneratedAPI>;
        
        /**
         * Closes the websocket and cleans up internal caches, also triggers the closed event on all generated APIs.
         * Eventually resolved when the websocket has been closed.
         * 
         * Note: you need to manually invoke this when you want to close a session and config.suspendOnClose is true.
         * @return Promise.
         */
        close(): Promise<any>;

        /**
         * Suspends the enigma.js session by closing the websocket and rejecting all method calls until it has been resumed again.
         * @return Promise.
         */
        suspend():Promise<any>;

        /**
         * Resume a previously suspended enigma.js session by re-creating the websocket and, if possible, re-open the document
         * as well as refreshing the internal caches. If successful, changed events will be triggered on all generated APIs,
         * and on the ones it was unable to restore, the closed event will be triggered.
         * @param onlyIfAttached onlyIfAttached can be used to only allow resuming if the QIX Engine session was reattached properly.
         * @return Promise.
         * Note: Eventually resolved when the websocket (and potentially the previously opened document, and generated APIs) has been restored, rejected when it fails any of those steps, or when onlyIfAttached is true and a new QIX Engine session was created.
         */
        resume(onlyIfAttached?:boolean):Promise<any>;

        /**         
         * Handle opened state. This event is triggered whenever the websocket is connected and ready for communication.      
         */
        on(event: "opened" , func:any);
        
        /**
         * Handle closed state. This event is triggered when the underlying websocket is closed and config.suspendOnClose is false.
         */
        on(event: "closed" , func: any);

        /**
         * Handle suspended state. This event is triggered in two cases (listed below). It is useful in scenarios where you for example want to block interaction in your application until you are resumed again.
         * If config.suspendOnClose is true and there was a network disconnect (socked closed)
         * If you ran session.suspend()
         * The evt.initiator value is a string indicating what triggered the suspended state. Possible values: network, manual.
         */
        on(event: "suspended", func: any);

        /**
         * Handle resumed state. This event is triggered when the session was properly resumed.
         * It is useful in scenarios where you for example can close blocking modal dialogs and allow the user to interact with your application again.
         */
        on(event: "resumed", func: any):void;

        /**
         * notification:*
         */
        on(event: string, func: any):void;
    }

    interface IGeneratedAPI  {
      
    }

}