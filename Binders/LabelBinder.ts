// LabelBinder assumes its working for elements which cannot receive input.

module Fenix.Binders {

    export class LabelBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "label";
        }


        public OnPropertyChange(value: any) {
            if (value == "undefined")
                value = this.GetValueByKey("fallback");
            this.Element.html(value);
        }

    }
}