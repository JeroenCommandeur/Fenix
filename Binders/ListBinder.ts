module Fenix.Binders {

    export class ListBinder extends Fenix.Base.BinderBase {

        private items: any[];
        private bindingContexts: BindingContext[] = [];
        private template: string;
        private isUpdating: boolean;
        private colors: string[];

        static AttributeName(): string {
            return "list";
        }


        private UnbindContexts() {
            this.bindingContexts.forEach((item: BindingContext, index, array) => {
                item.Unbind();
            });
            this.bindingContexts = [];
        }


        public Unbind() {
            this.UnbindContexts();
            super.Unbind();
        }


        public OnPropertyChange(value: any) {
            // We receive a new list of items. Unbind a previously bound list and its items.
            if (this.items) {
                $(this.items).off("add", this.Append);
                $(this.items).off("remove", this.Remove);
            }

            // Unbind each individual list item.
            this.UnbindContexts();

            // Clear the element that hosts the items on screen.
            this.Element.html(null);

            // Keep track of which list we're displaying in the element.
            this.items = value;
            
            if (!value)
                return;

            if (this.isUpdating)
                return;

            this.isUpdating = true;

            var type = this.GetValueByKey("TYPE");
            var template = this.GetValueByKey("TEMPLATE");
            var colors = this.GetValueByKey("COLORS");
            if (colors)
                this.colors = colors.split("/");

            // Get the HTML template as specified from our static templatemanager.
            // The TemplateManager gets the HTML from the server and then caches it.
            Types.TemplateManager.Retrieve(type, template, this, this.OnTemplateLoaded);
        }


        private OnTemplateLoaded(self, template: string) {
            // Reload the element by inserting html templates for each item in the list
            self.template = template;

            self.items.forEach((item, index, array) => {

                // Create a JQuery element. NOTE: all templates must wrap their content into a single element, like a div or table.
                // We need this because our binding algorithm traverses children of the element its processing. Therefor we need a
                // main element. See ElementBinder.Bind implementation.
                var element = $(template);

                self.Element.append(element);

                if (self.colors)
                    self.SetBackgroundColor(element, self.colors, index);

                // The item will serve as datacontext. We provide the execution context of the parent too. This means the execution
                // context of any template is always the viewmodel from which it originates.
                var bindingContext = new BindingContext();
                bindingContext.Bind(element, item, self.ExecutionContext);

                // Store the binding context so we can unbind it later.
                self.bindingContexts.push(bindingContext);
            });

            // Bind to add/remove/change events of the list so we can update the element automatically.
            $(self.items).on("add", { self: this }, this.Append);
            $(self.items).on("remove", { self: this }, this.Remove);

            self.isUpdating = false;
        }


        private SetBackgroundColor(element: JQuery, colors: string[], index: number) {

            var self = this;

            element.children().each(function () {
                var $child = jQuery(this);
                var color = colors[index % colors.length];
                $child.css("background-color", color);
                self.SetBackgroundColor($child, colors, index);
            });
        }


        private Append(event, item) {
            var self = event.data.self;
           
        }

        private Remove(event, item) {
            var self = event.data.self;

        }
    }
}