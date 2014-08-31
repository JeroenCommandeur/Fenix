module Fenix.Binders {
    export class VisibilityBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "visibility";
        }


        public OnPropertyChange(value: any) {
            var reverse = this.GetValueByKey("REVERSE")
            var isRow = this.GetValueByKey("ISROW");

            // We assume the property is always a boolean. Reverse it if wanted.
            if (reverse && reverse == "true")
                value = !value;

            if (isRow) {
                if (value)
                    this.Element.css('display', '');
                else
                    this.Element.css('display', 'none');

            } else {

                if (value)
                    this.Element.show();
                else
                    this.Element.hide();
            }
        }
    }
}