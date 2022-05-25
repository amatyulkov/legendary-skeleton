var setAttributes = function (el, attrs) {
    for (var attr in attrs) {
        el.setAttribute(attr, typeof attrs[attr] === "string"
            ? attrs[attr]
            : attrs[attr].toString());
    }
};

var alignRect = function (a, b) {
    var _a = a.getBoundingClientRect(), width = _a.width, height = _a.height, top = _a.top, left = _a.left;
    setAttributes(b, {
        width: width.toString(),
        height: height.toString(),
        y: top.toString(),
        x: left.toString(),
    });
};

var Identity = /** @class */ (function () {
    function Identity() {
    }
    Identity.next = function () {
        return this.id++;
    };
    Identity.id = 0;
    return Identity;
}());

var SVG_NS = "http://www.w3.org/2000/svg";

var FillSkeleton = /** @class */ (function () {
    function FillSkeleton(el) {
        this.el = el;
        this.rect = document.createElementNS(SVG_NS, "rect");
        this.rect.setAttribute("fill", "white");
    }
    FillSkeleton.prototype.sync = function () {
        var borderRadius = window.getComputedStyle(this.el).borderRadius;
        alignRect(this.el, this.rect);
        setAttributes(this.rect, { rx: borderRadius, fill: "white" });
    };
    FillSkeleton.prototype.getElements = function () {
        return [this.rect];
    };
    return FillSkeleton;
}());

var OutlineSkeleton = /** @class */ (function () {
    function OutlineSkeleton(el) {
        this.el = el;
        this.outer = document.createElementNS(SVG_NS, "rect");
        this.inner = document.createElementNS(SVG_NS, "rect");
        setAttributes(this.outer, { fill: "white" });
        setAttributes(this.inner, { fill: "black" });
    }
    OutlineSkeleton.prototype.getElements = function () {
        return [this.outer, this.inner];
    };
    OutlineSkeleton.prototype.sync = function () {
        var style = window.getComputedStyle(this.el);
        var _a = this.el.getBoundingClientRect(), top = _a.top, left = _a.left, width = _a.width, height = _a.height;
        var radius = parseFloat(style.borderRadius) || 0;
        var outlineWidth = parseFloat(style.borderWidth) || 1;
        alignRect(this.el, this.outer);
        setAttributes(this.outer, { rx: radius });
        setAttributes(this.inner, {
            width: width - outlineWidth * 2,
            height: height - outlineWidth * 2,
            rx: radius - outlineWidth,
            x: left + outlineWidth,
            y: top + outlineWidth,
        });
    };
    return OutlineSkeleton;
}());

var SkeletonPart = /** @class */ (function () {
    function SkeletonPart(el) {
        if (el.dataset.skeleton === "fill") {
            this.elements = new FillSkeleton(el);
        }
        else {
            this.elements = new OutlineSkeleton(el);
        }
        this.sync();
    }
    SkeletonPart.prototype.sync = function () {
        this.elements.sync();
    };
    return SkeletonPart;
}());

var SkeletonGradient = /** @class */ (function () {
    function SkeletonGradient(_a) {
        var animationDuration = _a.animationDuration, stops = _a.stops, namespace = _a.namespace;
        var _this = this;
        this.element = document.createElementNS(SVG_NS, "linearGradient");
        this.stops = [];
        this.element.id = "".concat(namespace, "-gradient-").concat(Identity.next());
        this.stops = this.createStops(stops);
        this.appendStops();
        setAttributes(this.element, {
            x1: "-200%",
            x2: "-100%",
            y1: "200%",
            y2: "100%",
        });
        var animateX1 = document.createElementNS(SVG_NS, "animate");
        var animateX2 = document.createElementNS(SVG_NS, "animate");
        var animateY1 = document.createElementNS(SVG_NS, "animate");
        var animateY2 = document.createElementNS(SVG_NS, "animate");
        setAttributes(animateX1, { attributeName: "x1", values: "-200%; 100%" });
        setAttributes(animateY1, { attributeName: "y1", values: "200%; -100%" });
        setAttributes(animateX2, { attributeName: "x2", values: "-100%; 200%" });
        setAttributes(animateY2, { attributeName: "y2", values: "100%; -200%" });
        var animations = [animateX1, animateX2, animateY1, animateY2];
        animations.forEach(function (x) {
            setAttributes(x, {
                dur: "".concat(animationDuration, "ms"),
                repeatCount: "indefinite",
            });
            _this.element.appendChild(x);
        });
    }
    SkeletonGradient.prototype.appendStops = function () {
        var _this = this;
        this.stops.forEach(function (el) { return _this.element.appendChild(el); });
    };
    SkeletonGradient.prototype.createStops = function (stops) {
        return stops.map(function (_a) {
            var _b;
            var color = _a.color, offset = _a.offset;
            var el = document.createElementNS(SVG_NS, "stop");
            setAttributes(el, (_b = {
                    offset: "".concat(offset * 100, "%")
                },
                _b["stop-color"] = color,
                _b));
            return el;
        });
    };
    SkeletonGradient.prototype.updateStops = function (stops) {
        this.removeStops();
        this.stops = this.createStops(stops);
        this.appendStops();
    };
    SkeletonGradient.prototype.removeStops = function () {
        this.stops.forEach(function (el) { return el.remove(); });
        this.stops = [];
    };
    return SkeletonGradient;
}());

// TODO: all private methods are probably public component APIs
var Skeleton = /** @class */ (function () {
    function Skeleton(el, config) {
        if (el === void 0) { el = document.body; }
        if (config === void 0) { config = {}; }
        this.el = el;
        this.parts = [];
        this.root = document.createElementNS(SVG_NS, "svg");
        this.fill = document.createElementNS(SVG_NS, "rect");
        this.defs = document.createElementNS(SVG_NS, "defs");
        this.mask = document.createElementNS(SVG_NS, "mask");
        this._isActive = false;
        this.config = this.parseConfig(config);
        this.gradient = new SkeletonGradient(this.config);
        this.activate();
    }
    Object.defineProperty(Skeleton.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        set: function (value) {
            this._isActive = value;
        },
        enumerable: false,
        configurable: true
    });
    Skeleton.prototype.getElement = function () {
        return this.root;
    };
    Skeleton.prototype.activate = function () {
        this.isActive = false;
        this.initMask();
        this.initFill();
        this.initRoot();
        this.initParts();
    };
    Skeleton.prototype.setConfig = function (config) {
        var stops = config.stops;
        if (stops) {
            this.gradient.updateStops(stops);
            this.config.stops = stops;
        }
    };
    Skeleton.prototype.deactivate = function () {
        this.isActive = true;
        this.getPartNodes().forEach(function (x) { return (x.style.visibility = ""); });
        this.root.remove();
    };
    Skeleton.prototype.initRoot = function () {
        var _a = this.el, scrollWidth = _a.scrollWidth, scrollHeight = _a.scrollHeight;
        this.root.style.position = "absolute";
        this.root.style.top = "0";
        this.root.style.left = "0";
        this.root.style.width = "100%";
        this.root.style.height = "100%";
        this.root.style.pointerEvents = "none";
        this.root.setAttribute("viewbox", "0 0 ".concat(scrollWidth, " ").concat(scrollHeight));
        this.root.appendChild(this.fill);
        this.root.appendChild(this.defs);
        this.defs.appendChild(this.mask);
        this.defs.appendChild(this.gradient.element);
        this.el.appendChild(this.root);
    };
    Skeleton.prototype.initMask = function () {
        this.mask.id = "".concat(this.config.namespace, "-mask-").concat(Identity.next());
    };
    Skeleton.prototype.initFill = function () {
        setAttributes(this.fill, {
            width: "100%",
            height: "100%",
            x: 0,
            y: 0,
            fill: "url(#".concat(this.gradient.element.id, ")"),
            mask: "url(#".concat(this.mask.id, ")"),
        });
    };
    Skeleton.prototype.initParts = function () {
        var _this = this;
        this.getPartNodes().forEach(function (el) {
            var part = new SkeletonPart(el);
            _this.parts.push(part);
            part.elements
                .getElements()
                .forEach(function (shapeEl) { return _this.mask.appendChild(shapeEl); });
            part.sync();
            el.style.visibility = "hidden";
        });
    };
    Skeleton.prototype.getPartNodes = function () {
        return Array.from(this.el.querySelectorAll(this.config.partSelector));
    };
    Skeleton.prototype.parseConfig = function (config) {
        var _a, _b, _c, _d;
        var namespace = (_a = config.namespace) !== null && _a !== void 0 ? _a : "skeleton";
        var color = "rgba(128, 128, 128, 0.1)";
        var highlight = "rgba(128, 128, 128, 0.2)";
        return {
            animationDuration: (_b = config.animationDuration) !== null && _b !== void 0 ? _b : 1000,
            namespace: namespace,
            partSelector: (_c = config.partSelector) !== null && _c !== void 0 ? _c : "[data-".concat(namespace, "]"),
            stops: (_d = config.stops) !== null && _d !== void 0 ? _d : [
                { offset: 0, color: color },
                { offset: 0.25, color: highlight },
                { offset: 0.5, color: color },
            ],
        };
    };
    Skeleton.prototype.register = function (item) {
        var _this = this;
        this.parts.push(item);
        item.elements.getElements().forEach(function (el) {
            _this.mask.appendChild(el);
        });
        item.sync();
    };
    Skeleton.prototype.sync = function () {
        this.parts.forEach(function (x) { return x.sync(); });
        this.root.setAttribute("viewbox", "0 0 ".concat(this.el.scrollWidth, " ").concat(this.el.scrollHeight));
    };
    return Skeleton;
}());

export { Skeleton, SkeletonPart };
