import React, {Component, PropTypes} from "react/addons";
import BSButton from "react-bootstrap/Button";
import BSModal from "react-bootstrap/Modal";
import createChainedFunction from "react-bootstrap/utils/createChainedFunction";


// Can be used without children (need to hold a reference to show)
// or have a single clickable child that will trigger the confirmation.
export default class ConfirmationTrigger extends Component {
  static propTypes = {
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
  }

  static defaultProps = {
    bsSize: "small",
    translationKeys: {
      confirmation: "Confirmation",
      message: "Are you sure you want to do this?",
      no: "No",
      yes: "Yes",
    },
  }

  state = {
    isOverlayShown: false,
  }

  /**
   * Own methods
   */

  onNo = () => {
    if (this.props.onNo){
      this.props.onNo();
    }

    this.hide();
  }

  onYes = () => {
    if (this.props.onYes){
      this.props.onYes();
    }

    this.hide();
  }

  hide = () => {
    this.setState({
      isOverlayShown: false,
    });
  }

  show = () => {
    this.setState({
      isOverlayShown: true,
    });
  }

  toggle = () => {
    this.setState({
      isOverlayShown: !this.state.isOverlayShown
    });
  }

  translate = (keyName) => {
    if (this.props.translate) {
      return this.props.translate(keyName);
    }

    return this.props.translationKeys[keyName] || keyName;
  }

  render() {
    const {
      // Don't retransmit.
      bsSize,
      message,
      children,

      ...props
    } = this.props;
    const child = React.Children.only(children);

    return React.cloneElement(
      child,
      {
        onClick: createChainedFunction(child.props.onClick, this.toggle),
        ...props,
      },
      [
        child.props.children,
        <BSModal
          bsSize={bsSize}
          onHide={this.onNo}
          show={this.state.isOverlayShown}
        >
          <BSModal.Header closeButton>
            <BSModal.Title>{this.translate("confirmation")}</BSModal.Title>
          </BSModal.Header>
          <BSModal.Body>
            {message || this.translate("message")}
          </BSModal.Body>
          <BSModal.Footer>
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
          </BSModal.Footer>
        </BSModal>
      ]
    );
  }
}
