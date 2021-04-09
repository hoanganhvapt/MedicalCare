export const collapseMenu = (dispatch) => {
    return {
        onComponentWillMount: () => dispatch({ type: "COLLAPSE_MENU" }),
    };
};

export const collapseNavBar = (dispatch) => {
    return {
        onToggleNavigation: () => dispatch({ type: "COLLAPSE_MENU" }),
    };
};

export const collapseNavigation = (dispatch) => {
    return {
        onToggleNavigation: () => dispatch({ type: "COLLAPSE_MENU" }),
        onChangeLayout: (layout) => dispatch({ type: "CHANGE_LAYOUT", layout: layout }),
    };
};

export const collapseToggle = (config) => {
    return {
        type: "COLLAPSE_TOGGLE",
        menu: config.menu,
    };
};

export const leaveNavContent = (dispatch) => {
    return {
        onNavContentLeave: () => dispatch({ type: "NAV_CONTENT_LEAVE" }),
    };
};

export const navCollapse = (dispatch) => {
    return {
        onCollapseToggle: (id, type) =>
            dispatch({
                type: "COLLAPSE_TOGGLE",
                menu: { id: id, type: type },
            }),
        onNavCollapseLeave: (id, type) =>
            dispatch({
                type: "NAV_COLLAPSE_LEAVE",
                menu: { id: id, type: type },
            }),
    };
};

export const navItem = (dispatch) => {
    return {
        onItemClick: () => dispatch({ type: "COLLAPSE_MENU" }),
        onItemLeave: () => dispatch({ type: "NAV_CONTENT_LEAVE" }),
    };
};

export const outsideClick = (dispatch) => {
    return {
        onToggleNavigation: () => dispatch({ type: "COLLAPSE_MENU" }),
    };
};
