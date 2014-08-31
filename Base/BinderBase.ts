import IBinder = Fenix.Interfaces.IBinder;
import IDataContext = Fenix.Interfaces.IDataContext;

module Fenix.Base {

    export class BinderBase implements IBinder {

        public ExecutionContext: any;
        public DataContext: IDataContext;
        public Element: JQuery;
        private Binding: string;
        
        // Helper object to get values from bindings.
        private bindingParser: Fenix.Types.BindingParser;

        private isBound: boolean;

        // Stores objects under a specific name found in the binding, so we can bind/unbind eventhandlers to these objects.
        // For example, if your binding is defined as Person.Address.Street, we would have entries for Person and Address in this store.
        private dataContextStore = {};

        // We bind binders to a datacontext by specifying eventhandlers to change events of a datacontext object. We need to be 
        // able to uniquely identify the binder when unbinding eventhandlers to change events of datacontext objects. Therefor,
        // we use a JQuery feature called namespacing in our change event name and put a GUID into the name.
        private changeEventName: string;


        static AttributeName(): string {
            // Contains the name of the attribute to be used on bound elements. Implement in descendants.
            return "";
        }


        public Bind(element: JQuery, dataContext: any, executionContext: any, attribute: string) {

            this.Element = element;
            this.DataContext = dataContext;
            this.ExecutionContext = executionContext;
            this.Binding = element.attr(attribute);

            this.OnInitialize();

            this.dataContextStore = {};

            // Use namespacing by appending a guid to the event name when setting up eventhandlers, so we can uniquely remove them when needed.
            // This is needed because multiple binders can be at work for one datacontext at a time. Using namespacing, we can savely remove 
            // eventhandlers for a single binder, instead of removing handlers from all binders.
            this.changeEventName = "change." + Fenix.Types.Utilities.NewGuid();

            // HouseNumber 
            // LastPost.Date
            // LastPost.Author.Address.Street

            // To provide deep binding, we need to setup a chain of eventhandlers to monitor changes
            // in any of the properties listed in the binding, leading up to the actual property we see on screen.
            //
            // If any of these properties change, we need to set a new eventhandler to the new object and unbind
            // any existing handler to the old object. For example: Author was set to a specific author object and an
            // eventhandler was set to monitor change in this particular author. Now Author is changed to null or to 
            // another author object. We now need to remove the eventhandler to the old Author object and setup a new
            // eventhandler to the new Author object. If Author was set to null, do not setup a new eventhandler, of course.
            // Also, we need to remove the eventhandler for Street (if any), then check if the new Author object has
            // a Street object and then set a new eventhandler to that Street object.

            var bindingProperty = this.GetValueByKey("PROPERTY");

            if (!bindingProperty) // If there is no property listed in the binding; attach a datacontext change handler only.
                $(this.DataContext).on(this.changeEventName, { self: this }, this.OnDataContextChangedHandler); 
            else // If there is a property binding available, setup a chain of eventhandlers to listed to change of the property.
                this.SetupEventHandlers(this.DataContext, 0);

            this.isBound = true;
        }


        public Unbind() {
            if (!this.isBound)
                return;
            
            // Remove eventhandlers from datacontexts.
            this.RemoveEventHandlers();

            // Remove html from screen; this will also remove eventhandlers bound to the element and its childs
            this.Element.html(null);

            this.isBound = false;
        }


        public GetValueByKey(key: string): string {
            if (!this.bindingParser)
                this.bindingParser = new Fenix.Types.BindingParser(this.Binding);

            return this.bindingParser.GetValueByKey(key);
        }


        private RemoveEventHandlers() {
            // Remove change handler for the main datacontext itself.
            $(this.DataContext).off(this.changeEventName);

            // Remove change handlers setup for any deep-bound property (Person.Address.Street etc).
            for (var key in this.dataContextStore) {
                var dataContext = this.dataContextStore[key];
                $(dataContext).off(this.changeEventName);
            }
            this.dataContextStore = {};
        }


        private SetupEventHandlers(dataContext: any, index: number) {

            var bindingProperty = this.GetValueByKey("PROPERTY");
            var elements = bindingProperty.split(".");
            var propertyName;

            // Remove all handlers starting from the given index.
            for (var i = index; i < elements.length; i++) {
                propertyName = elements[i];
                var existingDataContext = this.dataContextStore[propertyName];
                if (existingDataContext) {
                    $(existingDataContext).off(this.changeEventName);
                    this.dataContextStore[propertyName] = null;
                    existingDataContext = null;
                }
            }

            // Store a new datacontext for the given propertyname. E.g. For Person we store the DataContext. For Name we store Person.
            propertyName = elements[index];
            this.dataContextStore[propertyName] = dataContext;

            // Set a property changed eventhandler.
            $(dataContext).on(this.changeEventName, { self: this }, this.OnPropertyChangedHandler);

            // Process the next element of our binding.
            index++;
            if (index < elements.length) {
                var nextDataContext = dataContext[propertyName];
                if (!nextDataContext) {
                    this.OnPropertyChange(null);
                } else {
                    if (typeof nextDataContext === "object")
                        this.SetupEventHandlers(nextDataContext, index);
                }
            } else {
                // Trigger event for the last property in the chain; the one we're interested in particular.
                var value = dataContext[propertyName];
                if (!(typeof value === "function"))     // Trigger change event if it's a property and even if it doesn't have a value; descendants decide what to do with it.
                    this.OnPropertyChange(value);
            }
        }


        private OnDataContextChangedHandler(event, property: string, value: any) {
            var self = event.data.self;
            self.OnDataContextChange(property, value);
        }


        private OnPropertyChangedHandler(event, property: string, value: any) {
            var self = event.data.self;

            // Always notify a property in the datacontext has changed. This might not be the property specified in the binding, if any.
            // Most binders won't even react to it, but if they need to, they can.
            self.OnDataContextChange(property, value);

            // If the property specified in our binding (if any) has changed, notify.
            var index = self.GetIndex(property);
            if (index != -1) {
                // The given property is part of the binding. NOTE: this could go wrong in particular cases
                // where the datacontext has more properties with the same name. For example, a datacontext 
                // has the following properties:
                // - Person.Name
                // - Name
                // If the Name property changes, this eventhandler would be triggered because Name is part 
                // of the Person.Name binding.

                // If the property is the last property in the chain (Name in Person.Address.City.Name),
                // execute the OnPropertyChange method so the binder can do what it needs to do.
                if (self.IsActualProperty(property))
                    self.OnPropertyChange(value);
                else
                    // It's a property earlier in the chain. Re-setup the chain of events from that point.
                    self.SetupEventHandlers(this, self.GetIndex(property));
            }
        }


        private IsActualProperty(property: string): boolean {
            var bindingProperty = this.GetValueByKey("PROPERTY");
            var elements = bindingProperty.split(".");
            return elements[elements.length - 1] == property;
        }


        private GetIndex(property: string): number {
            var bindingProperty = this.GetValueByKey("PROPERTY");
            var elements = bindingProperty.split(".");
            return elements.indexOf(property);
        }


        public OnInitialize() {
            // Use this method to initialize HTML elements for twoway binding. Implement in descendants.
        }


        public OnDataContextChange(property: string, value: any) {
            // Notifies global changes in the datacontext. Some binders need to respond to that. Implement in descendants.
        }


        public OnPropertyChange(value: any) {
            // Notifies a change in the property specified in the binding. Implement in descendants.
        }


        // Helper method to be used by descendants to execute methods present in an executioncontext.
        // In some cases, datacontext and executioncontext are the same (viewmodel). In other cases,
        // for example when using html templates via ListBinder, executioncontext is the parenting
        // viewmodel for objects made visible using templates.
        public ExecuteMethod(methodName: string, params: any[]) {
            var fn = this.ExecutionContext[methodName];
            if (typeof fn === "function") {
                var method = $.proxy(fn, this.ExecutionContext);
                method(params);
            }
        }
    }
}