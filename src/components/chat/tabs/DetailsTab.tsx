import * as React from "react";
import * as PropTypes from "prop-types";
import { Header, Table, Modal, Button, Form, Icon } from "semantic-ui-react";
import TableFields from "components/shared/table-fields/TableFields";
import { getFieldName, getFieldValue } from "lib/helpers";

export default class DetailsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      member: []
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  isDisabled = field => {
    switch (field.toLowerCase()) {
      case "memberid":
      case "status":
      case "ssn":
      case "birthdate":
      case "signedOn":
        return true;
      default:
        return false;
    }
  };

  handleChange = field => e => {
    let { member } = this.state;
    member[field] = e.target.value;
    this.setState({ member });
  };

  handleCancel = () => {
    this.setState({ member: [] });
    this.handleClose();
  };

  handleSubmissionButton = () => {
    const { editMemberDetails, messages } = this.props;
    let submittedMember = { ...messages.member, ...this.state.member };
    editMemberDetails(submittedMember);
    this.handleClose();
  };

  render() {
    const {
      messages: { member }
    } = this.props;

    return member ? (
      <Table selectable>
        <Table.Body>
          <TableFields fields={member} />
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="2">
              <Modal
                trigger={
                  <Button
                    floated="right"
                    icon
                    labelPosition="left"
                    primary
                    size="medium"
                    onClick={this.handleOpen}
                  >
                    <Icon name="edit" /> Edit Member
                  </Button>
                }
                open={this.state.modalOpen}
                onClose={this.handleClose}
                basic
                size="small"
                dimmer="blurring"
              >
                <Header icon="edit" content="Edit Member" />
                <Modal.Content>
                  <Form inverted size="small">
                    <React.Fragment>
                      {Object.keys(member).map((field, id) => (
                        <Form.Input
                          key={id}
                          label={getFieldName(field)}
                          disabled={this.isDisabled(field)}
                          defaultValue={getFieldValue(member[field])}
                          onChange={this.handleChange(field)}
                        />
                      ))}
                    </React.Fragment>
                    <Button.Group floated="right" labelPosition="left">
                      <Button type="button" onClick={this.handleCancel}>
                        Cancel
                      </Button>
                      <Button.Or />
                      <Button
                        type="button"
                        onClick={this.handleSubmissionButton}
                        positive
                      >
                        Submit
                      </Button>
                    </Button.Group>
                  </Form>
                </Modal.Content>
              </Modal>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    ) : (
      <Header>No member info</Header>
    );
  }
}

DetailsTab.propTypes = {
  messages: PropTypes.object.isRequired,
  editMemberDetails: PropTypes.func.isRequired
};
