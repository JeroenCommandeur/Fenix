// TextBinder assumes its working for "input, textarea" elements.
module Fenix.Binders {
    export class TextBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "text";
        }


        public OnInitialize() {
            // If the element on screen changes, update the corresponding property in the datacontext.
            this.Element.change((e) => {
                var propertyName = this.GetValueByKey("PROPERTY");

                var value = this.Element.val();

                this.DataContext.SetProperty(propertyName, value);

                //var decoded = this.htmlDecode(value);

                //this.DataContext.SetProperty(propertyName, decoded);

                //if (value != decoded)
                //    this.Element.val(decoded);
            });
        }


        public OnPropertyChange(value: any) {
            if (this.Element.val() != value)
                this.Element.val(value);        //this.htmlEncode(value)
        }


        private htmlEncode(value) {
            var result = undefined;
            if (value)
                result = $('<div/>').text(value).html();
            return result;
        }


        private htmlDecode(value) {
            var result = undefined;
            if (value)
                result = $('<div/>').html(value).text();
            return result;
        }
    }
}