import fflip from 'fflip';

export default fflip;
// Doing this will allow you to import the entire fflip library as a single object 
// and use in tree-shaking.
let fflipConfig = fflip.config
let fflipCriteria = fflip.criteria
let fflipExpress = fflip.express
let fflipExpressMiddleware = fflip.expressMiddleware
let fflipExpressRoute = fflip.expressRoute
let fflipGetFeaturesForUser = fflip.getFeaturesForUser
let fflipIsFeatureEnabledForUser = fflip.isFeatureEnabledForUser
let fflipUserHasFeature = fflip.userHasFeature
let fflipFeatures = fflip.features

export {
    fflipConfig,
    fflipCriteria,
    fflipExpress,
    fflipExpressMiddleware,
    fflipExpressRoute,
    fflipGetFeaturesForUser,
    fflipIsFeatureEnabledForUser,
    fflipUserHasFeature,
    fflipFeatures
}; 