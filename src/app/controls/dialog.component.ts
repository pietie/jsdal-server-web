import { Component, EventEmitter, Output, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core'

import L2 from 'l2-lib/L2';

@Component({
    selector: 'l2dialog',
    templateUrl: './dialog.component.html',
})
export class L2Dialog {
    @Output() ready: EventEmitter<any> = new EventEmitter();
    @ViewChild('dlg') dlg;
    @ViewChild('container', { read: ViewContainerRef }) container;

    private _title: string;
    private options: IL2DialogOptions;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
        
    }

    get title(): string {
        return this._title;
    }

    set title(val: string) {
        this._title = val;
    }
     
    public show(type: any, options: IL2DialogOptions) {
        try {

            this.options = options;
            
            if (options) {
                this.title = options.title;
            }

            $(this.dlg.nativeElement).on('show.bs.modal', function () {
                //$('.modal-content').css('width', "90%");
                //$('.modal-content').css('height', "90%");
            });

            var factory = this.componentFactoryResolver.resolveComponentFactory(type);
            var ref:any = this.viewContainerRef.createComponent(factory);
                        
            if (options) ref.instance.dataContext = options.dataContext;

            $(this.dlg.nativeElement).modal();

            /*
            this.componentFactoryResolver.resolveComponent(type).then((factory) => {
                var comp = this.container.createComponent(factory);
                
                if (options) comp.instance.dataContext = options.dataContext;

                $(this.dlg.nativeElement).modal();
                
            });
            */

             
        }
        catch (e) {
            L2.handleException(e);
        }
    }

    public close() {
        $(this.dlg.nativeElement).modal("hide").remove();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    ngAfterViewInit() {
        this.ready.emit(null);
    }

    public static modal(componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, type: any, options?: IL2DialogOptions):L2Dialog {

        var factory = componentFactoryResolver.resolveComponentFactory(L2Dialog);
        var ref = viewContainerRef.createComponent(factory);

        ref.instance.ready.subscribe(() => {

            try {
                ref.instance.show(type, options);
            }
            catch (e) {
                L2.handleException(e);
            }
        });

        //ref.instance.onNewDbAdded.subscribe(() => {
        //    this.refreshDbConnectionList();
        //    L2.success("New database connection added successfully.");
        //});


        ////////////////
        //componentFactoryResolver.resolveComponent(L2Dialog).then((factory) => {
        //    var comp = viewContainerRef.createComponent(factory);
        
        //    comp.instance.ready.subscribe(() => {
        //        comp.instance.show(type, options)
        //    }); 

             
            
        //});

        return null;

    }
}

export enum DialogSize {
    small = 100,
    medium = 200,
    large = 300
}

interface IL2DialogOptions {
    title?: string;
    dataContext?: any;
    size?: DialogSize

}