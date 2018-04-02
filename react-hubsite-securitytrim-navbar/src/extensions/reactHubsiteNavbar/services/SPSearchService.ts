import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { ISearchResult } from './ISearchResult';
import { ISearchResults } from './ISearchResults';

export interface ISPSearchConfiguration {
    spHttpClient: SPHttpClient;
    siteURL: string;
}
export interface IHubSiteData {
    Title: string;
    ID: string;
    URL: string;
    Sites: IHubSiteData[];
}
export interface Navigation {
    Id: number;
    Title: string;
    Url: string;
    IsDocLib: boolean;
    IsExternal: boolean;
    ParentId: number;
    ListTemplateType: number;
    Children: any[];
}
export interface IAssociatedSite {
    themeKey: string;
    name: string;
    url: string;
    logoUrl?: any;
    usesMetadataNavigation: boolean;
    navigation: Navigation[];
}
export interface IGetAssociatedSite {
    value: string;
}
export interface IGetHubSiteData {
    value: IHubSiteData[];
}

export class SPSearchService {

    private spHttpClient: SPHttpClient;
    private siteURL: string;

    constructor(config: ISPSearchConfiguration) {
        this.spHttpClient = config.spHttpClient;
        this.siteURL = config.siteURL;
    }

    public async getHubSiteData(): Promise<IAssociatedSite> {
        let url = this.siteURL + "/_api/web/HubSiteData";

        return this.spHttpClient.get(url, SPHttpClient.configurations.v1, {
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'odata-version': '',
            }
        }).then((response: SPHttpClientResponse) => {
            return response.json();
        }).then((responseJSON: IGetAssociatedSite) => {
            let responseItem:IAssociatedSite;

            if(responseJSON.value){
                responseItem = JSON.parse(responseJSON.value);
            }
            return responseItem;
        });

    }
    public async getHubID(hubURL: string): Promise<IHubSiteData> {
        let url = this.siteURL + "/_api/HubSites?filter=SiteUrl eq '" + hubURL + "'";
        return this.spHttpClient.get(url, SPHttpClient.configurations.v1, {
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'odata-version': '',
            }
        }).then((response: SPHttpClientResponse) => {
            return response.json();
        }).then((responseJSON: IGetHubSiteData) => {
            let result: IHubSiteData = {
                Title: "",
                URL: "#",
                ID: null,
                Sites: []
            };
            var responseItems = responseJSON.value
            if (responseItems.length > 0) {
                result.ID = responseItems[0].ID
            }
            return result;
        });

    }
    public async getSitesInHub(hubID: string): Promise<IHubSiteData[]> {
        let url = this.siteURL + "/_api/search/query?querytext='DepartmentId:{" + hubID + "} contentclass:STS_Site'&selectproperties='Title,Path,DepartmentId,SiteId'";
        return this.spHttpClient.get(url, SPHttpClient.configurations.v1, {
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'odata-version': '',
            }
        }).then((response: SPHttpClientResponse) => {
            return response.json();
        }).then((responseJSON: ISearchResults) => {
            let result: IHubSiteData[] = [];
            var responseItems = responseJSON.PrimaryQueryResult.RelevantResults.Table.Rows;
            for (let site of responseItems) {
                //filter out hubsite root
                if (site.Cells[5].Value != hubID) {
                    result.push({
                        ID: site.Cells[4].Value,
                        URL: site.Cells[3].Value,
                        Title: site.Cells[2].Value,
                        Sites: []
                    });
                }
            }
            return result;
        });

    }
}