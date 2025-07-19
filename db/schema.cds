namespace com.logaligroup;

using {
    cuid,
    sap.common.CodeList
} from '@sap/cds/common';


entity Products : cuid {
    product     : String(8)     @title: 'Product';
    productName : String(80)    @title: 'Product Name';
    description : LargeString   @title: 'Description';
    price       : Decimal(5, 2) @title: 'Price';
    currency    : Association to Currencies;
};

entity Currencies : CodeList {
    key code : String enum {
            USD = 'USD';
            EUR = 'EUR';
            COP = 'COP';
        };
};
