import IView = Fenix.Interfaces.IView;
import IViewModel = Fenix.Interfaces.IViewModel;
import BinderBase = Fenix.Base.BinderBase;
import BindingContext = Fenix.Types.BindingContext;

module Fenix.Binders {

    // ViewModelBinder is an essential part of Fenix.
    export class ViewModelBinder extends BinderBase {

        private bindingContext: BindingContext;

        static AttributeName(): string {
            return "viewmodel";
        }


        public Bind(element: JQuery, dataContext: any, executionContext: any, attribute: string) {
            this.bindingContext = new BindingContext();

            if (attribute == "self") {
                // The provided datacontext IS the viewmodel which we need to show on screen.
                // This is used by the bootstrapper when initializing the application, for example.
                this.Element = element;
                this.DataContext = dataContext;
                this.ExecutionContext = executionContext;
                this.DoLoad(dataContext);
            }
            else {
                // The provided datacontext has a property of type viewmodel which we need to show on screen.
                // We need to monitor this datacontext for change and load the viewmodel when needed.
                super.Bind(element, dataContext, executionContext, attribute);
            }
        }


        public Unbind() {
            this.bindingContext.Unbind();
            super.Unbind();
        }


        public OnPropertyChange(value: any) {
            if (!value) {
                // The viewmodel was set to NULL. Remove any content on screen.
                this.Unload();

            } else {
                // We receive a ViewModel. When its view has HTML available, load it on screen and bind to its elements.
                this.DoLoad(value);
            }
        }
        

        private DoLoad(viewModel: IViewModel) {
            if (viewModel.View.HTML)
                this.Load(viewModel);
            else {

                if (viewModel.View.HtmlFullName == "NOHTML") {
                    this.Load(viewModel);
                } else {

                    $(viewModel.View).on("loaded", () => {
                        $(viewModel.View).off();
                        this.Load(viewModel);
                    });
                }
            }
        }


        private Unload() {
            this.bindingContext.Unbind();
            this.Element.html(null);
        }


        private Load(viewModel: IViewModel) {
            // If the element already contained a view, it wil be replaced by the one we're loading now.
            this.Unload();

            // Show the HTML on screen and bind its elements to the viewmodel.
            var view = viewModel.View;
            if (view.HtmlFullName != "NOHTML") {
                this.Element.html(view.HTML);

                // Bind the elements of the view to the viewmodel. Use a specific execution context.
                var executionContext = viewModel;
                if (this.GetValueByKey("OverloadExecutionContext"))
                    executionContext = this.ExecutionContext;

                this.bindingContext.Bind(this.Element, viewModel, executionContext);
            }

            // Perform specific tasks now that the view is loaded.
            view.OnViewLoaded();
            viewModel.OnViewLoaded();

            viewModel.IsViewLoaded = true;

            // Notify world.
            $(viewModel).trigger("loaded");
        }
    }
}