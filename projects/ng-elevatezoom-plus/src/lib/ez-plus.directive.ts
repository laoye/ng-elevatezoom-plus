import {Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[ez-plus]'
})
export class EzPlusDirective implements OnInit, OnChanges, OnDestroy {

  @Input('ezp-model') ezpModel: any;

  @Input('ezp-options') ezpOptions: any;

  private bootstrapped = false;
  private loader: boolean;
  private lastPlugin = null;
  private zoomIds = {};
  private options: any = {};

  constructor(private el: ElementRef) {
    console.log(el);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.ezpOptions) {
      this.ezpOptionsChange(changes.ezpOptions);
    }
    if (changes.ezpModel) {
      this.ezpModelChange(changes.ezpModel);
    }
  }

  ngOnDestroy() {
    const plugin = this.getZoomPlugin();
    if (plugin) {
      plugin.destroy();
    }
    for (let zoomId in this.zoomIds) {
      if (this.zoomIds.hasOwnProperty(zoomId)) {
        const zoomContainer = $(document).find('[uuid=' + zoomId + ']');
        zoomContainer.remove();
      }
    }
    this.zoomIds = {};
  }

  private ezpOptionsChange(change: SimpleChange) {
    if (!this.bootstrapped) {
      Object.assign(this.options, change.currentValue);
      if (this.options.appendto) {
        this.options.zoomContainerAppendTo = this.options.appendto;
      }
      this.bootstrapped = true;
    } else {
      const plugin = this.getZoomPlugin();
      plugin.destroy();
      Object.assign(this.options, change.currentValue);
      if (plugin) {
        this.preparePlugin(this.el.nativeElement, this.options);
      }
    }
  }

  private ezpModelChange(change: SimpleChange) {
    const image = change.currentValue;
    const thumbUrl = (image && image.thumb) || '';
    const smallUrl = (image && image.small) || '';
    const largeUrl = (image && image.large) || '';

    let initialUrl = null;
    const plugin = this.getZoomPlugin();
    if (plugin && plugin.options.enabled) {
      if (image) {
        this.hideZoom();
        if (this.loader) {
          plugin.swaptheimage(this.loader, this.loader);
        }

        initialUrl = getInitialUrl(this.options, smallUrl);
        $(this.el.nativeElement).data('data-' + (this.ezpOptions.attrImageZoomSrc || 'zoom-image'), largeUrl);
        plugin.swaptheimage(initialUrl, largeUrl);
        this.showZoom();
      } else {
        plugin.closeAll();
      }
    } else {
      if (image) {
        initialUrl = getInitialUrl(this.options);
        if (initialUrl) {
          $(this.el.nativeElement).attr('src', initialUrl);
        }
        $(this.el.nativeElement).attr('data-' + (this.ezpOptions.attrImageZoomSrc || 'zoom-image'), largeUrl);
        this.preparePlugin(this.el.nativeElement, this.options);
      }
    }

    function getInitialUrl(options, defaultUrl?: string) {
      let initialUrl = defaultUrl;
      if (options.initial === 'thumb') {
        initialUrl = thumbUrl;
      } else if (options.initial === 'small') {
        initialUrl = smallUrl;
      } else if (options.initial === 'large') {
        initialUrl = largeUrl;
      }
      return initialUrl;
    }
  }

  private getZoomPlugin(element?: any) {
    return $(element ? element : this.el.nativeElement).data('ezPlus');
  }

  private hideZoom() {
    const action = 'hide';
    const plugin = this.getZoomPlugin();
    if (plugin) {
      plugin.showHideZoomContainer(action);
    }
  }

  private showZoom() {
    const action = 'show';
    const plugin = this.getZoomPlugin();
    if (plugin) {
      plugin.showHideZoomContainer(action);
    }
  }

  private preparePlugin(element: any, options: any) {
    console.log(element);
    console.log(options);
    const plugin = $(element).ezPlus(options);
    this.lastPlugin = plugin && plugin.length > 0 ? this.getZoomPlugin(plugin[0]) : null;
    if (this.lastPlugin) {
      this.zoomIds[this.lastPlugin.options.zoomId] = true;
    }
    return this.lastPlugin;
  }


}
