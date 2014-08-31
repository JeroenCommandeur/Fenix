module Fenix.Binders {

    export class ColorBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "color";
        }


        public OnPropertyChange(value: any) {
            if (value)
                this.Element.css("background-color", value);
        }
    }
}