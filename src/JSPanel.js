"use strict";
/**
 * @class Creates a panel that follows the digital accessibility recommendations.
 */
class JSPanel {
    /**
     * @constructs JSPanel
     * @param {HTMLButtonElement} button The button which will display the panel.
     * @param {{top?:number,right?:number,bottom?:number,left?:number,items:Array<{title:string,icon?:string,fontawesome_icon?:string,fontawesome_color?:string,className?:string,attributes?:Array<Array<string>>,onclick?:Function,separator?:boolean}>}} options The options to customize the panel.
     */
    constructor(button, options) {
        /**
         * The panel.
         * @type {HTMLElement|null}
         * @default null
         * @private
         */
        this.panel = null;
        this.button = button;
        this.options = options;
        this.panel_uniqueid = "jspanel-" + this._rand(0, 1000000);
        this._buildPanel();
        this.button.setAttribute("aria-expanded", "false");
        this.button.setAttribute("aria-controls", this.panel_uniqueid);
    }
    /**
     * Builds the panel.
     * @private
     */
    _buildPanel() {
        const top = this.options.top === undefined ? null : this.options.top + "px";
        const right = this.options.right === undefined ? null : this.options.right + "px";
        const bottom = this.options.bottom === undefined ? null : this.options.bottom + "px";
        const left = this.options.left === undefined ? null : this.options.left + "px";
        this.panel = this._createEl("div", { id: this.panel_uniqueid, className: "jspanel panel-hidden" });
        if (top || right || bottom || left) {
            if (top)
                this.panel.style.top = top;
            if (left)
                this.panel.style.left = left;
            if (right)
                this.panel.style.right = right;
            if (bottom)
                this.panel.style.bottom = bottom;
        }
        else {
            this.panel.style.top = "0px";
            this.panel.style.left = "0px";
        }
        const parent = this.button.parentElement === null ? document.body : this.button.parentElement;
        const style_position = window.getComputedStyle(parent).getPropertyValue("position");
        if (!this._inArray(style_position, ["fixed", "absolute", "relative"]))
            parent.style.position = "relative";
        //
        // items
        //
        if (this.options.items) {
            const container = this._createEl("div", { className: "container-items" });
            for (let item of this.options.items) {
                const built_item = this._buildItem(item);
                container.appendChild(built_item);
            }
            this.panel.appendChild(container);
        }
        else {
            throw new Error("You need to define items to be displayed in the panel.");
        }
        // 
        // events
        //
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (target && this.panel) {
                if (!this.panel.contains(target) && this._isOpen()) {
                    this._closePanel();
                }
            }
        });
        this.button.addEventListener("click", (e) => this._togglePanel(e));
        this.button.addEventListener("keydown", (e) => this._toggleOnKeyboardEvent(e));
        this._insertAfterButton(this.panel);
    }
    /**
     * Following the digital accessibility recommendations for this kind of panels,
     * it is necessary to open or close the panel by clicking either the Enter or Space key.
     * See {@link https://www.accede-web.com/en/guidelines/rich-interface-components/show-hide-panels/} for more information.
     * @param {KeyboardEvent} e The keyboard event.
     * @private
     */
    _toggleOnKeyboardEvent(e) {
        if (e.key === "Enter" || e.code === "Enter" || e.keyCode === 13 || e.key === " " || e.keyCode === 32 || e.code === "Space") {
            e.preventDefault();
            this._togglePanel(e);
        }
    }
    /**
     * Checks if the panel is currently opened or not.
     * @returns {boolean} True if the panel is opened.
     * @private
     */
    _isOpen() {
        if (this.panel) {
            return !this.panel.classList.contains("panel-hidden");
        }
        else {
            return false;
        }
    }
    /**
     * Open the panel if it's closed, close if it's opened.
     * @param {MouseEvent|KeyboardEvent} e The mouse event or the keyboard event.
     * @private
     */
    _togglePanel(e) {
        if (this.button && this.panel) {
            e.stopPropagation();
            if (this._isOpen()) {
                this._closePanel();
            }
            else {
                this.button.setAttribute("aria-expanded", "true");
                this.panel.classList.remove("panel-hidden");
                const all_items = this._getAllItems();
                if (all_items && all_items[0])
                    all_items[0].focus();
            }
        }
    }
    /**
     * Gets all the items from the panel if it's open.
     * @returns {NodeListOf<HTMLButtonElement>|null} All the items.
     */
    _getAllItems() {
        if (this._isOpen()) {
            return this.panel.querySelectorAll("button");
        }
        else {
            return null;
        }
    }
    /**
     * Gets all the active items from the panel if it's open.
     * @returns {Array<Element>|null} All the items that have an onclick property.
     */
    _getAllActiveItems() {
        if (this._isOpen()) {
            const active_elements = Array.from(this.panel.querySelectorAll("button"));
            active_elements.push(this.button);
            return active_elements;
        }
        else {
            return null;
        }
    }
    /**
     * Closes the panel.
     * @private
     */
    _closePanel() {
        if (this.button && this.panel) {
            this.button.setAttribute("aria-expanded", "false");
            this.panel.classList.add("panel-hidden");
        }
    }
    /**
     * Creates a customizable div element.
     * @param {string} tagName The name of the tag.
     * @param {{id?:string,className?:string,textContent?:string,attributes?:Array<string>,styles?:Array<string>}} options The options to customize the element.
     * @returns {HTMLElement} The created element.
     * @private
     */
    _createEl(tagName, options) {
        const el = document.createElement(tagName);
        if (!options)
            return el;
        if (options.id)
            el.setAttribute("id", options.id);
        if (options.textContent)
            el.textContent = options.textContent;
        if (options.className) {
            const classes = options.className.split(" ");
            for (let clas of classes) {
                el.classList.add(clas);
            }
        }
        if (options.styles) {
            for (let style of options.styles) {
                const property = style[0];
                const value = style[1];
                el.style[property] = value;
            }
        }
        if (options.attributes) {
            for (let attr of options.attributes) {
                const name = attr[0];
                const value = attr[1];
                el.setAttribute(name, value);
            }
        }
        return el;
    }
    /**
     * Builds an item.
     * @param {{title:string,icon?:string,fontawesome_icon?:string,fontawesome_color?:string,className?:string,attributes?:Array<Array<string>>,onclick?:Function,separator?:boolean}} item The item to build.
     * @returns {HTMLElement} The item as an HTML element.
     * @private
     */
    _buildItem(item) {
        if (item.separator) {
            const div = this._createEl("div", { className: 'jspanel-separator' });
            return div;
        }
        else {
            const button = this._createEl("button");
            button.setAttribute("aria-label", item.title);
            button.setAttribute("tabindex", "0");
            if ((item.icon && !item.fontawesome_icon) || (item.icon && item.fontawesome_icon)) {
                const icon = this._createEl("img", { attributes: [["src", item.icon]] });
                button.appendChild(icon);
            }
            else if (!item.icon && item.fontawesome_icon) {
                const icon = this._createEl("i", { className: item.fontawesome_icon });
                if (item.fontawesome_color)
                    icon.style.color = item.fontawesome_color;
                button.appendChild(icon);
            }
            if (item.className) {
                const classes = item.className.split(" ");
                for (let clas of classes) {
                    button.classList.add(clas);
                }
            }
            if (item.attributes) {
                for (let attr of item.attributes) {
                    const name = attr[0];
                    const value = attr[1];
                    button.setAttribute(name, value);
                }
            }
            const title = this._createEl("span", { textContent: item.title });
            button.appendChild(title);
            button.addEventListener('click', () => {
                if (item.onclick)
                    item.onclick();
                this._closePanel();
            });
            button.addEventListener("keydown", (e) => {
                if (e.key === "Tab" || e.keyCode === 9) {
                    if (this._isOpen())
                        this._focusInPanel(e);
                }
            });
            return button;
        }
    }
    /**
     * Blocks the focus inside the panel while it's open.
     * @param {KeyboardEvent} e The keyboard event.
     */
    _focusInPanel(e) {
        const all_items = this._getAllActiveItems();
        if (all_items) {
            e.preventDefault();
            let index = Array.from(all_items).findIndex(f => this.panel ? f === this.panel.querySelector(":focus") : false);
            if (e.shiftKey === true) {
                index--;
            }
            else {
                index++;
            }
            if (index >= all_items.length) {
                index = 0;
            }
            if (index < 0) {
                index = all_items.length - 1;
            }
            all_items[index].focus();
        }
    }
    /**
     * Checks the presence of an element in an array
     * @param {any} needle The element to search in the array.
     * @param {Array<any>} haystack The array in which to search for the element.
     * @param {boolean} strict Is the type of the needle necessary when searching? By default: false.
     * @returns {boolean} True if the needle was found.
     * @private
     */
    _inArray(needle, haystack, strict = false) {
        const length = haystack.length;
        for (let i = 0; i < length; i++) {
            if (strict) {
                if (haystack[i] === needle)
                    return true;
            }
            else {
                if (haystack[i] == needle)
                    return true;
            }
        }
        return false;
    }
    /**
     * Inserts the panel into the DOM (after the button).
     * @param {HTMLElement} panel The panel to insert after the button.
     * @private
     */
    _insertAfterButton(panel) {
        const parent = this.button.parentElement === null ? document.body : this.button.parentElement;
        parent.insertBefore(panel, this.button.nextSibling);
    }
    /**
     * Generates a random number [min;max[
     * @param {number} min The minimum number (included).
     * @param {number} max The maximum number (not included).
     * @returns {number} A random number between minimum and maximum.
     * @private
     */
    _rand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
