module Fenix.Base {

    export class ViewBase implements IView {

        private nameSpace: string;

        private wrapView: boolean;
        private wrapHtml: string;

        // The fullname of the html on the server.
        public HtmlFullName: string;

        // Cached html markup. NOTE: also cached by TemplateManager. Used by ViewModelBinder to load HTML on screen.
        public HTML: string;


        constructor(namespace: string, htmlFullName: string, wrapView: boolean) {

            this.nameSpace = namespace;
            this.HtmlFullName = htmlFullName;
            this.wrapView = wrapView;

            if (this.HtmlFullName == "NOHTML")
                $(this).trigger("loaded");
            else 
                Types.TemplateManager.Retrieve("Fenix.Templates.View", "Fenix/Templates/View.html", this, this.OnWrapperLoaded);
        }


        private OnWrapperLoaded(self, html: string) {
            self.wrapHtml = html;
            Types.TemplateManager.Retrieve(self.nameSpace, self.HtmlFullName, self, self.OnTemplateLoaded);
        }


        private OnTemplateLoaded(self, html: string) {
            if (self.wrapView)
                self.HTML = self.wrapHtml.replace("%CONTENT%", html);
            else
                self.HTML = html;
            $(self).trigger("loaded");
        }


        public OnViewLoaded() {
            // Override in descendants. Is called by ViewModelBinder when the view has been loaded.
        }


        public OnActivated() {

        }
    }
}