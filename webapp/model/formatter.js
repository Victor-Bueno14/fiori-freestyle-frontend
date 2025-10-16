sap.ui.define([
], function(){
    "use strict";

    return {
        formatPrice: function (sValue) {
            const oFormatOptions = {
                groupingEnabled: true,
                groupingSeparator: ".",
                decimalSeparator: ",",
                decimals: 2
            }

            const oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);

            return oFloatFormat.format(parseFloat(sValue));
        },

        formatCpf: function (sValue) {
            //Removendo tudo, exceto números
            sValue = sValue.replace(/\D/g, '');

            //Adicionando pontuação 
            sValue = sValue.slice(0,3) + "." +
                     sValue.slice(3,6) + "." +
                     sValue.slice(6,9) + "." +
                     sValue.slice(9,11);

            return sValue;
        },

        formatStatus: function (sValue) {
            switch (sValue){
                case "N":
                    return "New";
                case "A":
                    return "Approved";
                case "D":
                    return "Denied";
            };
        }
    };
})