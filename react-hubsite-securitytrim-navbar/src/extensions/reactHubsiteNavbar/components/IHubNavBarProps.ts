import * as HubSiteData from './../services/SPSearchService'; 
import ApplicationCustomizerContext from '@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext';

export interface IHubNavBarProps {
    menuItem:HubSiteData.IHubSiteData;
    navHeading:string;
    context: ApplicationCustomizerContext;
}
