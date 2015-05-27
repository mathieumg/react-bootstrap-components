import React from "react/addons";
import BSOverlayMixin from "react-bootstrap/OverlayMixin";
import BSButton from "react-bootstrap/Button";
import BSModal from "react-bootstrap/Modal";

const PropTypes = React.PropTypes;
const cloneWithProps = React.addons.cloneWithProps;

// FIXME: Leverage https://github.com/react-bootstrap/react-bootstrap/pull/745
function createChainedFunction(one, two) {
  const hasOne = typeof one === "function";
  const hasTwo = typeof two === "function";

  if (!hasOne && !hasTwo) { return null; }
  if (!hasOne) { return two; }
  if (!hasTwo) { return one; }

  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

// Can be used without children (need to hold a reference to show)
// or have a single clickable child that will trigger the confirmation.
export default React.createClass({
  /**
   * React mixins
   */

  mixins: [BSOverlayMixin],

  /**
   * React properties
   */

  propTypes: {
    // Bootstrap size to use for the modal.
    bsSize: PropTypes.string,

    // If we have a child it needs to be a node.
    children: PropTypes.node,

    // Custom message to display in the confirmation box.
    message: PropTypes.string,

    // Callback when the user selects yes.
    onYes: PropTypes.func,

    // Callback when the user selects no.
    onNo: PropTypes.func,

    // Callback to translate strings.
    translate: PropTypes.func,

    // Translatable strings.
    translationKeys: PropTypes.objectOf(PropTypes.string),
  },

  /**
   * React lifecycle
   */

  getDefaultProps: function () {
    return {
      bsSize: "small",
      translate: this.translate,
      translationKeys: {
        confirmation: "Confirmation",
        message: "Are you sure you want to do this?",
        no: "No",
        yes: "Yes",
      }
    };
  },

  getInitialState: function () {
    return {
      isOverlayShown: false
    };
  },

  /**
   * Own methods
   */

  onNo: function(){
    if(this.props.onNo){
      this.props.onNo();
    }
    this.hide();
  },

  onYes: function(){
    if(this.props.onYes){
      this.props.onYes();
    }
    this.hide();
  },

  hide: function () {
    this.setState({
      isOverlayShown: false
    });
  },

  show: function () {
    this.setState({
      isOverlayShown: true
    });
  },

  toggle: function () {
    this.setState({
      isOverlayShown: !this.state.isOverlayShown
    });
  },

  translate: function (keyName) {
    return this.props.translationKeys[keyName] || keyName;
  },

  renderOverlay: function () {
    if (!this.state.isOverlayShown) {
      return null;
    }

    return (
      <BSModal
        bsSize={this.props.bsSize}
        title={this.translate("confirmation")}
        onRequestHide={this.onNo}
      >
        <div className="modal-body">
          {this.props.message || this.translate("message")}
        </div>
        <div className="modal-footer">
          <BSButton
            bsStyle="success"
            onClick={this.onYes}
          >
            {this.translate("yes")}
          </BSButton>
          <BSButton
            bsStyle="danger"
            onClick={this.onNo}
          >
            {this.translate("no")}
          </BSButton>
        </div>
      </BSModal>
    );
  },

  /**
   * React render
   */

  render: function () {
    if (this.props.children) {
      const {
        // Don't retransmit.
        bsSize,
        message,
        children,

        ...props
      } = this.props;
      const child = React.Children.only(children);

      // Pass down handlers if we don't redefine them.
      const childProps = {
        ...props,
        onClick: createChainedFunction(child.props.onClick, this.toggle),
      };

      return cloneWithProps(
        child,
        childProps
      );
    }

    return null;
  }
});
