import Utilities = Fenix.Types.Utilities;
import DataContextBase = Fenix.Base.DataContextBase;    // IMPORTANT: keep this reference here, otherwise the compiled Fenix.js file will not work. It somehow needs this reference at this specific location.

module Fenix.Base {

    export class ViewModelBase extends DataContextBase implements IViewModel {

        public View: IView;

        public OverruleViewCreation: boolean;
        public WrapView: boolean;

        public IsViewLoaded: boolean;

        public IsBusy: boolean;
        public Message: Fenix.Types.Message;

        constructor(wrapView: boolean = false) {
            super();

            this.RegisterProperties(["IsBusy", "Message"]);

            if (this.OverruleViewCreation)
                return;

            this.IsBusy = false;
            this.WrapView = wrapView;

            var viewModelName = Utilities.GetClassName(this);
            var namespace = Fenix.Framework.ViewModels[viewModelName];

            var viewName = viewModelName.substr(0, viewModelName.length - 5);
            var htmlFullName = (namespace + "." + viewName).split('.').join('/') + ".html";

            this.View = this.CreateView(viewName, namespace, htmlFullName, this.WrapView);

            this.Message = new Fenix.Types.Message();

            console.debug(viewModelName + ": " + namespace);
        }


        private CreateView(viewName: string, namespace: string, htmlFullName: string, wrapView: boolean): IView {

            var instance = null;
            instance = window;
            var elements = namespace.split(".");
            for (var i = 0; i < elements.length; i++) {
                instance = instance[elements[i]];
            }

            if (instance[viewName])
                return new instance[viewName](namespace + "." + viewName, htmlFullName, wrapView);
            else    // A view doesn't exist. Create one using our view base class.
                return new Fenix.Base.ViewBase(namespace + "." + viewName, htmlFullName, wrapView);

        }


        public OnViewLoaded() {
            // Called by viewmodelbinder when loaded. Override in descendants.
        }


        public OnActivated() {
            // Called by navigator. Override in descendants.
        }

    }
}