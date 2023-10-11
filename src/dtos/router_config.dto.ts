export class RouterConfigDto {
    routes: any;
    constructor(newRoute: any, methodName: string, urlRoute: string, routes: any) {
        this.routes = routes;
        this.init(newRoute, methodName, urlRoute);
    }

    init(newRoute: any, methodName: string, urlRoute: string) {
        if (newRoute[methodName] === undefined) {
            throw new Error(`Method ${methodName} not found in ${newRoute.constructor.name}`);
        }

        newRoute[methodName]();
        this.routes.use(urlRoute, newRoute.getRoute());
    }
}
