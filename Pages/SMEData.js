import { faker} from '@faker-js/faker';

const phone1 = Math.floor(Math.pow(10, 7) + Math.random() * Math.pow(10, 7));
const phoneNumber = `91${phone1}`;

const availableColors = faker.helpers.shuffle(['Red','White', 'Blue', 'Green', 'Black', 'Purple', 'Yellow']);
 
export const ShopifyCustomer = {
    FirstName: faker.person.firstName(),
    LastName: faker.person.lastName(),
    CustomerEmail: faker.internet.email(),
    CustomerPhone: phoneNumber,
    CustomerCompany: faker.company.name(),
};  

export const productData = {
    Product: faker.commerce.productName(),
    ProductDescription: faker.commerce.productDescription(),
    ProductPrice: faker.commerce.price({ min: 100, max: 500 }),
    ProductVariant1: availableColors[0],
    ProductVariant2: availableColors[2],
    ProductVariant3: availableColors[4],
    ProductTags: faker.word.words(),
    ProductVariantPrices: [
        faker.commerce.price({ min: 100, max: 300 }),
        faker.commerce.price({ min: 200, max: 400 }),
        faker.commerce.price({ min: 300, max: 500 })],
    ProductVariantQuantity:[
        faker.number.int({min:20, max:50}),
        faker.number.int({min:40, max:70}),
        faker.number.int({min:10, max:35})],
    ProductVariantSize: faker.commerce.productAdjective(),
    ProductWeight: faker.number.int({ min: 10, max: 20})    
};

export const orderData = {
    variantQuantity: [
        faker.number.int({ min: 1, max: 5 }),
        faker.number.int({ min: 10, max: 15 }),
        faker.number.int({ min: 15, max: 20 }),]
};

export const SalesforceCreds = {
        username: "smeauto@gmail.com",
        password: "System@1234",
        url: "https://login.salesforce.com/?locale=in"
};

export const ShopifyData = {
    ShopifyURL: "https://www.shopify.com/in",
    ShopifyLoginButton: 'Login'
};