using {com.logaligroup as entites} from '../db/schema';


service ProductSRV {
    entity Products as projection on entites.Products;
    @readonly
    entity VH_Currencies as projection on entites.Currencies;
};