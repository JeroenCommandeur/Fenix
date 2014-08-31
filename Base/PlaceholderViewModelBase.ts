
module Fenix.Base {

    // Perhaps rename to ContainerViewmodelBase?
    export class PlaceholderViewModelBase extends ViewModelBase implements Fenix.Interfaces.IPlaceholderViewModel {

        constructor() {
            super();
            this.RegisterProperties(["Item"]);
        }

        public Item: IViewModel;

    }
}