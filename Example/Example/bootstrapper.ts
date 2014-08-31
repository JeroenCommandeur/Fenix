/// <reference path="Fenix/Scripts/Fenix.d.ts" />
/// <reference path="Client/Scripts/jquery.d.ts" />

class BootStrapper {

    constructor() {
        // Initialize the Fenix framework first. Continue when the framework is loaded.
        Fenix.Framework.Initialize(["Client"], this.Initialize);
    }


    private Initialize() {

        // Create our main application viewmodel and perform actions when its loaded.
        var appViewModel = Fenix.Types.Utilities.CreateViewModel("AppViewModel", null);
        $(appViewModel).on("loaded", () => {
            Fenix.Types.Navigator.Goto(location.hash, true);
        });

        // Place viewmodel in DOM. This is the only place where a ViewModelBinder has to be called via code.
        // In all other cases, it will be automatically created by the binding code.
        var element = $("#body");
        var viewModelBinder = new Fenix.Binders.ViewModelBinder();
        viewModelBinder.Bind(element, appViewModel, appViewModel, "self");

        // Feed the appViewModel to the navigator to serve as root viewmodel.
        Fenix.Types.Navigator.Root = appViewModel;

       

        // React to changes in our hash for navigation purposes.
        window.onhashchange = () => {
            try {
                Fenix.Types.Navigator.Goto(location.hash, true);
            } catch (e) {
                console.log("Navigation error");
            }
        };
    }
}