import * as React from 'react';
import * as ReactDom from 'react-dom';

import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
  IO365ShellRenderSettings
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import pnp, { DateTimeFieldFormatType } from "sp-pnp-js";
import * as strings from 'ReactHubsiteNavbarApplicationCustomizerStrings';
import * as SPSearchService from './services/SPSearchService';
import HubNavBar from './components/HubNavBar';
import { IHubNavBarProps } from './components/IHubNavBarProps';
import { IAssociatedSite, IHubSiteData } from '../../../lib/extensions/reactHubsiteNavbar/services/SPSearchService';
import SPPermission from '@microsoft/sp-page-context/lib/SPPermission';

const LOG_SOURCE: string = 'ReactHubsiteNavbarApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IReactHubsiteNavbarApplicationCustomizerProperties {
  // This is an example; replace with your own property
  NavHeading?: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ReactHubsiteNavbarApplicationCustomizer
  extends BaseApplicationCustomizer<IReactHubsiteNavbarApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _currentHubSiteData: SPSearchService.IHubSiteData;

  @override
  public async onInit(): Promise<void> {
    
    pnp.setup({
      defaultCachingStore: "session",
      defaultCachingTimeoutSeconds: 900,
      globalCacheDisable: false
    });

    let searchService: SPSearchService.SPSearchService = new SPSearchService.SPSearchService({
      spHttpClient: this.context.spHttpClient,
      siteURL: this.context.pageContext.web.absoluteUrl
    });

    this._currentHubSiteData = await searchService.getHubSiteData().then((hubData: IAssociatedSite) => {
      if(hubData){
        return searchService.getHubID(hubData).then((hub: IHubSiteData) => {
          hub.Navigation = hubData.navigation;
          return hub;
        });
      }
      else{
        return null;
      }
    });

    if (this._currentHubSiteData != null) {
      let cachedMenu = pnp.storage.session.get("HUBNAV_" + this._currentHubSiteData.ID);
      if (cachedMenu != null) {
        this._currentHubSiteData = cachedMenu;
      }
      else {
        this._currentHubSiteData.Sites = await searchService.getSitesInHub(this._currentHubSiteData.ID);
        pnp.storage.session.put("HUBNAV_" + this._currentHubSiteData.ID, this._currentHubSiteData);
      }

      this._renderPlaceHolders();
    }
    return Promise.resolve<void>();
  }

  private _renderPlaceHolders(): void {
    this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', ');

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }

      if (this._currentHubSiteData != null && this._currentHubSiteData.Sites.length > 0 || this._currentHubSiteData != null && this._currentHubSiteData.Navigation.length) {
        const element: React.ReactElement<IHubNavBarProps> = React.createElement(
          HubNavBar,
          {
            menuItem: this._currentHubSiteData,
            navHeading:this.properties.NavHeading,
            context:this.context
          }
        );

        ReactDom.render(element, this._topPlaceholder.domElement);
      }
    }

  }
  private _onDispose(): void {
    console.log('[HubNavBarApplicationCustomizer._onDispose] Disposed custom top placeholders.');
  }

}
