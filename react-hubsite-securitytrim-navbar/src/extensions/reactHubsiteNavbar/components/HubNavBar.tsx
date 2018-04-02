import * as React from 'react';
import { IHubNavBarProps } from './IHubNavBarProps';
import { IHubNavBarState } from './IHubNavBarState';
import styles from './../AppCustomizer.module.scss';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

import * as SearchService from './../services/SPSearchService';
import { IHubSiteData } from './../services/SPSearchService';
import { ContextualMenu } from 'office-ui-fabric-react/lib/components/ContextualMenu';

export default class HubNavBar extends React.Component<IHubNavBarProps, IHubNavBarState>{

    constructor(){
        super();
        this.state = {

        };
    }

    private siteMenuItem(menuItem:SearchService.IHubSiteData, itemType:ContextualMenuItemType):IContextualMenuItem{  
        return({
                key:menuItem.ID,
                name:menuItem.Title,
                itemType:itemType,
                href:menuItem.URL,
                subMenuProps:menuItem.Sites.length > 0?
                {items:menuItem.Sites.map((i) => {return(this.siteMenuItem(i,ContextualMenuItemType.Normal))})}:null,
                isSubMenu:null,    
        });
    }

    public render() : React.ReactElement<IHubNavBarProps>{
        let commandBarItems:IContextualMenuItem[] =[];
        commandBarItems.push(this.siteMenuItem(this.props.menuItem, ContextualMenuItemType.Header));

        return (
            <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.app}`}>
            <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.top}`}>
                <CommandBar
                className={styles.commandBar}
                isSearchBoxVisible={ false }
                elipisisAriaLabel='More options'
                items={ commandBarItems }
                />
            </div>
          </div>
        )

    }

    
}