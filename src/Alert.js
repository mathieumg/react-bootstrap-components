import React from "react";
import BSAlert from "react-bootstrap/Alert";

const PropTypes = React.PropTypes;

export default React.createClass({
  /**
   * React properties
   */

  propTypes: {
    // Type of alert to display.
    bsStyle: PropTypes.oneOf(["warning", "danger", "success", "info"]),

    // If we have a child, it's the message we need to display in the alert.
    // Otherwise, we display no alert.
    children: PropTypes.node,

    // If true, the alert will not displayed again if it was hidden and its
    // properties were changed.
    noReset: PropTypes.bool,

    // Callback when the alert is closed.
    onHide: PropTypes.func,

    // Whether the alert message can be closed (dismissed) or not.
    permanent: PropTypes.bool,
  },

  /**
   * React lifecycle
   */

  getDefaultProps: function () {
    return {
      // Display an "info" alert.
      bsStyle: "info",

      // Allow the message to be dismissed.
      permanent: false,
    };
  },

  getInitialState: function () {
    return {
      // Whether the alert message is displayed or not.
      display: true
    };
  },

  componentWillReceiveProps: function () {
    if (!this.props.noReset) {
      this.setState({display: true});
    }
  },

  /**
   * Own methods
   */

  /**
   * Hides the alert.
   */
  hide: function() {
    this.setState(
      {display: false},
      () => {
        if (this.props.onHide) {
          this.props.onHide();
        }
      }
    );
  },

  /**
   * React render
   */

  render: function() {
    // Message to display.
    var message = this.props.children;

    // Bootstrap style to use.
    var bsStyle = this.props.bsStyle;

    // Display the Bootstrap alert if necessary.
    if (this.state.display && message) {
      return (
        <BSAlert
          // Uses the same style as Bootstrap to define the alert style.
          bsStyle={bsStyle}

          // React-Bootstrap will only display a close button if the onDismiss
          // event handler property is defined.
          onDismiss={!this.props.permanent ? this.hide : undefined}
        >
          {message}
        </BSAlert>
      );
    }

    // If we're not displaying the alert, return an empty node.
    return null;
  }
});
