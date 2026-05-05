module.exports = [
"[project]/Documents/Subpay/frontend/app/favicon.ico.mjs { IMAGE => \"[project]/Documents/Subpay/frontend/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/Subpay/frontend/app/favicon.ico.mjs { IMAGE => \"[project]/Documents/Subpay/frontend/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/Documents/Subpay/frontend/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/Subpay/frontend/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Documents/Subpay/frontend/app/(authenticated)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/Subpay/frontend/app/(authenticated)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { jsxDEV: _jsxDEV, Fragment: _Fragment } = __turbopack_context__.r("[project]/Documents/Subpay/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
// ─── Content Preview Popover ──────────────────────────────────────────────────
function ContentPreviewPopover({ item }) {
    const fileUrl = item.file_url ?? item.url ?? null;
    const thumbnailUrl = item.thumbnail_url ?? null;
    const textBody = item.text_body ?? item.body ?? null;
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 w-[220px] bg-white rounded-[14px] border-[1.5px] border-[#DDD6FE] overflow-hidden pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150",
        style: {
            boxShadow: "0 8px 28px rgba(45,0,82,0.14)"
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                className: "w-full relative",
                style: {
                    aspectRatio: "16/10"
                },
                children: [
                    item.content_type === "video" && (fileUrl ? /*#__PURE__*/ _jsxDEV(_Fragment, {
                        children: [
                            /*#__PURE__*/ _jsxDEV("video", {
                                src: fileUrl,
                                className: "w-full h-full object-cover",
                                poster: thumbnailUrl ?? undefined,
                                preload: "metadata",
                                muted: true
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 22,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "absolute inset-0 bg-black/30 flex items-center justify-center",
                                children: /*#__PURE__*/ _jsxDEV("div", {
                                    className: "w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2]",
                                    children: /*#__PURE__*/ _jsxDEV("svg", {
                                        width: "14",
                                        height: "14",
                                        viewBox: "0 0 16 16",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ _jsxDEV("path", {
                                            d: "M4 2.5v11l9-5.5-9-5.5Z"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                            lineNumber: 32,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 31,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                    lineNumber: 30,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 29,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : thumbnailUrl ? /*#__PURE__*/ _jsxDEV(_Fragment, {
                        children: [
                            /*#__PURE__*/ _jsxDEV("img", {
                                src: thumbnailUrl,
                                alt: item.title,
                                className: "w-full h-full object-cover"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 39,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "absolute inset-0 bg-black/30 flex items-center justify-center",
                                children: /*#__PURE__*/ _jsxDEV("div", {
                                    className: "w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2]",
                                    children: /*#__PURE__*/ _jsxDEV("svg", {
                                        width: "14",
                                        height: "14",
                                        viewBox: "0 0 16 16",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ _jsxDEV("path", {
                                            d: "M4 2.5v11l9-5.5-9-5.5Z"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                            lineNumber: 43,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                    lineNumber: 41,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 40,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ _jsxDEV("div", {
                        className: "w-full h-full bg-[#1a0030] flex flex-col items-center justify-center gap-1.5",
                        children: [
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50",
                                children: /*#__PURE__*/ _jsxDEV("svg", {
                                    width: "14",
                                    height: "14",
                                    viewBox: "0 0 16 16",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ _jsxDEV("path", {
                                        d: "M4 2.5v11l9-5.5-9-5.5Z"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 52,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 50,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ _jsxDEV("span", {
                                className: "text-[9px] text-white/30 font-medium",
                                children: "Video"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 55,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 49,
                        columnNumber: 13
                    }, this)),
                    item.content_type === "image" && (fileUrl || thumbnailUrl ? /*#__PURE__*/ _jsxDEV("img", {
                        src: fileUrl ?? thumbnailUrl,
                        alt: item.title,
                        className: "w-full h-full object-cover"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 62,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ _jsxDEV("div", {
                        className: "w-full h-full bg-[#F3E8FF] flex flex-col items-center justify-center gap-1.5",
                        children: [
                            /*#__PURE__*/ _jsxDEV("svg", {
                                width: "20",
                                height: "20",
                                viewBox: "0 0 20 20",
                                fill: "none",
                                stroke: "#C4B5D4",
                                strokeWidth: "1.4",
                                strokeLinecap: "round",
                                children: [
                                    /*#__PURE__*/ _jsxDEV("rect", {
                                        x: "2",
                                        y: "2",
                                        width: "16",
                                        height: "16",
                                        rx: "3"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 70,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("circle", {
                                        cx: "7",
                                        cy: "7.5",
                                        r: "1.5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 71,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("path", {
                                        d: "M2 14l4-4 3 3 3-4 6 6"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 69,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ _jsxDEV("span", {
                                className: "text-[9px] text-[#C4B5D4] font-medium",
                                children: "Image"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 68,
                        columnNumber: 13
                    }, this)),
                    item.content_type === "pdf" && /*#__PURE__*/ _jsxDEV("div", {
                        className: "w-full h-full bg-[#FBF8FF] flex flex-col items-center justify-center gap-1.5",
                        children: [
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "w-8 h-8 rounded-[9px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]",
                                children: /*#__PURE__*/ _jsxDEV("svg", {
                                    width: "12",
                                    height: "12",
                                    viewBox: "0 0 13 13",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "1.5",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV("path", {
                                            d: "M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("path", {
                                            d: "M7.5 1v3.5H11M4 7h5M4 9.5h3"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ _jsxDEV("span", {
                                className: "text-[9px] text-[#A08DBE] font-semibold uppercase tracking-wide",
                                children: "PDF Document"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    item.content_type === "text" && /*#__PURE__*/ _jsxDEV("div", {
                        className: "w-full h-full bg-[#FBF8FF] p-3 flex flex-col justify-start overflow-hidden",
                        children: textBody ? /*#__PURE__*/ _jsxDEV("p", {
                            className: "text-[11px] text-[#6B4F8A] leading-[1.6] line-clamp-4",
                            style: {
                                fontFamily: "Georgia, serif"
                            },
                            children: textBody
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                            lineNumber: 96,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ _jsxDEV("div", {
                            className: "flex flex-col items-center justify-center h-full gap-1.5",
                            children: [
                                /*#__PURE__*/ _jsxDEV("svg", {
                                    width: "18",
                                    height: "18",
                                    viewBox: "0 0 18 18",
                                    fill: "none",
                                    stroke: "#C4B5D4",
                                    strokeWidth: "1.4",
                                    strokeLinecap: "round",
                                    children: /*#__PURE__*/ _jsxDEV("path", {
                                        d: "M3 4h12M3 8h8M3 12h10M3 16h6"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ _jsxDEV("span", {
                                    className: "text-[9px] text-[#C4B5D4] font-medium",
                                    children: "Text post"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                    lineNumber: 107,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                            lineNumber: 103,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "px-3 pt-2.5 pb-3",
                children: [
                    /*#__PURE__*/ _jsxDEV("p", {
                        className: "text-[12px] font-semibold text-[#2D0052] leading-snug mb-1.5",
                        style: {
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                        },
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "flex items-center gap-1.5 flex-wrap",
                        children: [
                            /*#__PURE__*/ _jsxDEV(StatusPill, {
                                published: item.is_published
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("span", {
                                className: "text-[10.5px] text-[#A08DBE]",
                                children: [
                                    TYPE_CONFIG[item.content_type].label,
                                    " · ",
                                    formatDate(item.created_at)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "mt-2 flex items-center gap-1 text-[10.5px] font-semibold text-[#8A2BE2] bg-[#F3E8FF] border border-[#EDE5F8] rounded-[6px] px-2 py-1 w-fit",
                        children: [
                            /*#__PURE__*/ _jsxDEV("svg", {
                                width: "10",
                                height: "10",
                                viewBox: "0 0 12 12",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "1.6",
                                strokeLinecap: "round",
                                children: /*#__PURE__*/ _jsxDEV("path", {
                                    d: "M7.5 1H11v3.5M4.5 11H1V7.5M11 1L7 5M1 11l4-4"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            "Click to expand"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
// ─── Content Row ──────────────────────────────────────────────────────────────
function ContentRow({ item, isSelected, onToggle, onPreview }) {
    const { mutate: togglePublish, isPending: togglingPub } = useTogglePublish();
    const { mutate: deleteItem, isPending: deleting } = useDeleteContentItem();
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "group relative flex items-center gap-0 border-b transition-colors",
        style: {
            borderColor: B.soft,
            background: isSelected ? B.wash : B.white
        },
        onMouseEnter: (e)=>{
            if (!isSelected) e.currentTarget.style.background = B.wash;
        },
        onMouseLeave: (e)=>{
            if (!isSelected) e.currentTarget.style.background = B.white;
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                className: "w-12 flex items-center justify-center shrink-0 py-4",
                children: /*#__PURE__*/ _jsxDEV("input", {
                    type: "checkbox",
                    checked: isSelected,
                    onChange: onToggle,
                    className: "w-[14px] h-[14px] rounded cursor-pointer",
                    style: {
                        accentColor: B.purple
                    }
                }, void 0, false, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "w-12 flex items-center justify-center shrink-0",
                children: /*#__PURE__*/ _jsxDEV(TypeChip, {
                    type: item.content_type
                }, void 0, false, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                    lineNumber: 165,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("button", {
                onClick: ()=>onPreview(item),
                className: "flex-1 min-w-0 text-left py-4 pr-4",
                children: [
                    /*#__PURE__*/ _jsxDEV("p", {
                        className: "text-[13px] font-semibold truncate leading-snug transition-colors",
                        style: {
                            color: B.ink
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.color = B.purple,
                        onMouseLeave: (e)=>e.currentTarget.style.color = B.ink,
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("p", {
                        className: "text-[11px] mt-0.5",
                        style: {
                            color: B.faint
                        },
                        children: [
                            formatDate(item.created_at),
                            item.plan && /*#__PURE__*/ _jsxDEV("span", {
                                children: [
                                    " · ",
                                    /*#__PURE__*/ _jsxDEV("span", {
                                        style: {
                                            color: B.purple
                                        },
                                        children: item.plan.name
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                        lineNumber: 181,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "w-[130px] shrink-0 hidden md:flex items-center",
                children: item.plan ? /*#__PURE__*/ _jsxDEV("span", {
                    className: "text-[11.5px] font-semibold px-2.5 py-1 rounded-full border",
                    style: {
                        color: B.purple,
                        background: B.soft,
                        borderColor: B.border
                    },
                    children: item.plan.name
                }, void 0, false, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                    lineNumber: 189,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ _jsxDEV("span", {
                    className: "text-[11.5px]",
                    style: {
                        color: B.faint
                    },
                    children: "All subscribers"
                }, void 0, false, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                    lineNumber: 190,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "w-[108px] shrink-0 hidden sm:flex items-center",
                children: /*#__PURE__*/ _jsxDEV(StatusPill, {
                    published: item.is_published
                }, void 0, false, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "w-[88px] shrink-0 flex items-center justify-end gap-1 pr-4",
                children: [
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: ()=>togglePublish(item.id),
                        disabled: togglingPub,
                        title: item.is_published ? "Unpublish" : "Publish",
                        className: "opacity-0 group-hover:opacity-100 w-7 h-7 rounded-[7px] flex items-center justify-center transition-all disabled:opacity-30",
                        style: {
                            color: B.muted,
                            border: `1px solid ${B.border}`,
                            background: B.white
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.color = B.purple;
                            e.currentTarget.style.background = B.soft;
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.color = B.muted;
                            e.currentTarget.style.background = B.white;
                        },
                        children: Icon.eye
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: ()=>onPreview(item),
                        title: "Preview",
                        className: "opacity-0 group-hover:opacity-100 w-7 h-7 rounded-[7px] flex items-center justify-center transition-all",
                        style: {
                            color: B.muted,
                            border: `1px solid ${B.border}`,
                            background: B.white
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.color = B.purple;
                            e.currentTarget.style.background = B.soft;
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.color = B.muted;
                            e.currentTarget.style.background = B.white;
                        },
                        children: Icon.file
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: ()=>{
                            if (confirm("Delete this content?")) deleteItem(item.id);
                        },
                        disabled: deleting,
                        title: "Delete",
                        className: "opacity-0 group-hover:opacity-100 w-7 h-7 rounded-[7px] flex items-center justify-center transition-all disabled:opacity-30",
                        style: {
                            color: B.faint,
                            border: `1px solid ${B.border}`,
                            background: B.white
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.color = "#EF4444";
                            e.currentTarget.style.background = "#FFF5F5";
                            e.currentTarget.style.borderColor = "#FECACA";
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.color = B.faint;
                            e.currentTarget.style.background = B.white;
                            e.currentTarget.style.borderColor = B.border;
                        },
                        children: Icon.trash
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(ContentPreviewPopover, {
                item: item
            }, void 0, false, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
}),
"[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/Subpay/frontend/app/(authenticated)/content/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1c49e5e3._.js.map