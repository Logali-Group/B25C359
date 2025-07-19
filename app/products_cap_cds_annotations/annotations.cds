using ProductSRV as service from '../../srv/products';

annotate service.Products with {

    price    @Measures.ISOCurrency: currency_code;
    currency @title : 'Currency' @Common.IsCurrency;
};


annotate service.Products with @(
    UI.SelectionFields: [
        product,
        currency_code
    ],
    UI.HeaderInfo: {
        $Type : 'UI.HeaderInfoType',
        TypeName : 'Product',
        TypeNamePlural : 'Products',
        Title : {
            $Type : 'UI.DataField',
            Value : productName
        },
        Description: {
            $Type : 'UI.DataField',
            Value : product
        }
    },
    UI.LineItem: [
        {
            $Type: 'UI.DataField',
            Value: product
        },
        {
            $Type: 'UI.DataField',
            Value: productName
        },
        {
            $Type : 'UI.DataField',
            Value : description
        },
        {
            $Type: 'UI.DataField',
            Value: price
        }
    ],
    UI.FieldGroup #ProductInformation: {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: product
            },
            {
                $Type: 'UI.DataField',
                Value: productName
            },
            {
                $Type : 'UI.DataField',
                Value : description
            },
            {
                $Type: 'UI.DataField',
                Value: price
            } 
        ],
        Label : 'Product Information'
    },
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            Target : '@UI.FieldGroup#ProductInformation',
            Label : 'Product Information',
            ID : 'ProductInformation'
        }
    ]
);
