import * as React from 'react';
import { IHubNavBarProps } from './IHubNavBarProps';
import { IHubNavBarState } from './IHubNavBarState';
import styles from './../AppCustomizer.module.scss';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

import * as SearchService from './../services/SPSearchService';
import { IHubSiteData } from './../services/SPSearchService';
import { ContextualMenu } from 'office-ui-fabric-react/lib/components/ContextualMenu';
import SPPermission from '@microsoft/sp-page-context/lib/SPPermission';

export default class HubNavBar extends React.Component<IHubNavBarProps, IHubNavBarState>{

    constructor(){
        super();
        this.state = {

        };
    }

    private siteTrimmedMenuItem(menuItem:SearchService.IHubSiteData, itemType:ContextualMenuItemType):IContextualMenuItem{  
        return({
                key:menuItem.ID,
                name:menuItem.Title,
                itemType:itemType,
                href:menuItem.URL,
                subMenuProps:menuItem.Sites.length > 0?
                {items:menuItem.Sites.map((i) => {return(this.siteTrimmedMenuItem(i,ContextualMenuItemType.Normal))})}:null,
                isSubMenu:null,    
        });
    }
    private siteMenuItem(menuItem:SearchService.Navigation, itemType:ContextualMenuItemType):IContextualMenuItem{  
        return({
                key:menuItem.Id.toString(),
                name:menuItem.Title,
                itemType:itemType,
                href:menuItem.Url,
                subMenuProps:menuItem.Children.length > 0?
                {items:menuItem.Children.map((i) => {return(this.siteMenuItem(i,ContextualMenuItemType.Normal))})}:null,
                isSubMenu:true,    
        });
    }
  
    private _editOnClick(){
        let elm = document.getElementsByClassName('ms-HubNav')[0];
        elm.setAttribute("style","display:flex;");
    }
    private _hideHubNav(){
        let elm = document.getElementsByClassName('ms-HubNav')[0];
        elm.setAttribute("style","display:none;");
    }
    public render() : React.ReactElement<IHubNavBarProps>{
        debugger;
       //hide default hub nav
       this._hideHubNav();

       const commandBarItems: IContextualMenuItem[] = [];
       //push default intranet hub link
       commandBarItems.push({ 
            key:"RootHub",
            name:this.props.menuItem.Title,    
            itemType:ContextualMenuItemType.Header,
            href:this.props.menuItem.URL       
        });

        //push existing navigation elements
       this.props.menuItem.Navigation.map((i) => {
            commandBarItems.push(this.siteMenuItem(i, ContextualMenuItemType.Normal));
        });      
        //set sites listing heading
        this.props.menuItem.Title = this.props.navHeading;
        //push security trimmed nav
        commandBarItems.push(this.siteTrimmedMenuItem(this.props.menuItem, ContextualMenuItemType.Normal));
        
        //if user has manage web permissions, show edit button
        const hasPermission:boolean = this.props.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb);
   
        if(hasPermission && this.props.context.pageContext.legacyPageContext.webAbsoluteUrl === this.props.menuItem.URL){
            commandBarItems.push({ 
                key:"editButton",
                name:"Edit",
                itemType:ContextualMenuItemType.Header,
                onClick:this._editOnClick,
                className:"editButton",
                href:"#"
            });
        }
   
        return (
            <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.top}`}>
                <CommandBar
                className={styles.commandBar}
                isSearchBoxVisible={ false }
                elipisisAriaLabel='More options'
                items={ commandBarItems }
                />
            </div>
        )

    }

    
}