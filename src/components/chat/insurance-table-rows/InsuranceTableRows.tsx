import * as React from "react";
import * as PropTypes from "prop-types";
import * as moment from "moment";
import styled from "styled-components";
import { Button, Radio, Table } from "semantic-ui-react";
import DateInput from "components/shared/inputs/DateInput";
import { ACTIVATION_DATE, CANCELLATION_DATE } from "lib/messageTypes";

const DateCell = styled(Table.Cell)`
  &&& {
    display: flex;
    align-items: center;
  }
`;

const FileButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 100px;
  cursor: pointer;
  background-color: #e0e1e2;
  color: #00000099 !important;
  font-weight: 700;
  border-radius: 0.28571429rem;

  &:hover {
    background-color: #cacbcd;
    color: #000000cc !important;
  }
`;

const FlexCell = styled(Table.Cell)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const RowValue = styled.span`
  margin-right: 10px;
`;

export default class InsuranceTableRows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activationDatePickerDisabled: true,
      cancellationDatePickerDisabled: true,
      activationDateValue: null,
      cancellationDateValue: null
    };
  }

  saveNewDate = () => {
    const {
      messages: { member },
      insurance,
      saveInsuranceDate
    } = this.props;
    if (
      this.state.activationDateValue &&
      !this.state.activationDatePickerDisabled
    ) {
      saveInsuranceDate(
        this.state.activationDateValue,
        ACTIVATION_DATE,
        member.memberId,
        insurance.data.productId
      );
      this.setState({ activationDatePickerDisabled: true });
    }
    if (
      this.state.cancellationDateValue &&
      !this.state.cancellationDatePickerDisabled
    ) {
      saveInsuranceDate(
        this.state.cancellationDateValue,
        CANCELLATION_DATE,
        member.memberId,
        insurance.data.productId
      );
      this.setState({ cancellationDatePickerDisabled: true });
    }
  };

  cancelInsuranceClick = () => {
    const {
      insurance: { data },
      sendCancelRequest
    } = this.props;
    sendCancelRequest(data.memberId);
  };

  dateChangeHandler = (type, e, { value }) => {
    switch (type) {
      case ACTIVATION_DATE:
        this.setState({
          activationDateValue: moment(value).format("YYYY-MM-DD")
        });
        break;
      case CANCELLATION_DATE:
        this.setState({
          cancellationDateValue: moment(value).format("YYYY-MM-DD")
        });
        break;
      default:
        console.warn(
          "Class: InsuranceTableRows Function: dateChangeHandler Message: Not avaialable case"
        );
    }
  };

  toggleEdit = changeType => {
    switch (changeType) {
      case ACTIVATION_DATE:
        this.setState({
          activationDatePickerDisabled: !this.state.activationDatePickerDisabled
        });
        break;
      case CANCELLATION_DATE:
        this.setState({
          cancellationDatePickerDisabled: !this.state
            .cancellationDatePickerDisabled
        });
        break;
      default:
        console.warn(
          "Class: InsuranceTableRows Function: toggleEdit Message: Not avaialable case"
        );
    }
  };

  downloadClick = () => {
    const {
      messages: { member }
    } = this.props;
    //eslint-disable-next-line no-undef
    window.open(`/api/member/mandate/${member.memberId}`);
  };

  changeHandler = e => {
    const {
      messages: { member },
      sendCertificate
    } = this.props;
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.set("file", e.target.files[0]);
    sendCertificate(formData, member.memberId);
  };

  changeCompanyStatus = (e, { checked }) => {
    const {
      messages: { member },
      changeCompanyStatus
    } = this.props;
    changeCompanyStatus(checked, member.memberId);
  };

  getFormattedDate = date => {
    //FIXME : we need to remove Z after insuranceActiveFrom and insuranceActiveTo when we will change the type of datetime from backend.
    const dateToBeFormated = moment(date + "Z").local();
    return dateToBeFormated.isValid()
      ? dateToBeFormated.format("DD MMMM YYYY")
      : "-";
  };

  render() {
    const { activeDate, cancellationDate, insurance } = this.props;
    const certIsExist = insurance.data.certificateUploaded;
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell>Insured at other company</Table.Cell>
          <Table.Cell>
            <Radio
              toggle
              checked={insurance.data.insuredAtOtherCompany}
              onChange={this.changeCompanyStatus}
              disabled={insurance.requesting}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Insurance Mandate</Table.Cell>
          <Table.Cell>
            <Button onClick={this.downloadClick}>Download</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Insurance certificate</Table.Cell>
          <FlexCell>
            {certIsExist ? (
              <React.Fragment>
                <Button
                  content="View existing"
                  onClick={e => {
                    e.preventDefault();
                    window.location.assign(insurance.data.certificateUrl);
                  }}
                />
                <input
                  type="file"
                  name="certFile"
                  id="certFile"
                  multiple={false}
                  onChange={this.changeHandler}
                  style={{ display: "none" }}
                  ref={input => {
                    this.fileInput = input;
                  }}
                />
                <FileButton htmlFor="certFile">Upload new</FileButton>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <input
                  type="file"
                  name="certFile"
                  id="certFile"
                  multiple={false}
                  onChange={this.changeHandler}
                  style={{ display: "none" }}
                  ref={input => {
                    this.fileInput = input;
                  }}
                />
                <FileButton htmlFor="certFile">Upload file</FileButton>
              </React.Fragment>
            )}
          </FlexCell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Send cancellation email to existing insurer</Table.Cell>
          <Table.Cell>
            {insurance.data.cancellationEmailSent ? (
              <RowValue>Already sent</RowValue>
            ) : (
              <Button onClick={this.cancelInsuranceClick}>Send</Button>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Insurance active from</Table.Cell>
          <DateCell>
            {this.state.activationDatePickerDisabled ? (
              <React.Fragment>
                {activeDate && (
                  <RowValue>{this.getFormattedDate(activeDate)}</RowValue>
                )}
                <Button onClick={e => this.toggleEdit(ACTIVATION_DATE)}>
                  Edit
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <DateInput
                  changeHandler={this.dateChangeHandler}
                  changeType={ACTIVATION_DATE}
                />
                <Button onClick={this.saveNewDate} primary>
                  Save
                </Button>
                <Button onClick={e => this.toggleEdit(ACTIVATION_DATE)}>
                  Close
                </Button>
              </React.Fragment>
            )}
          </DateCell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Insurance active to</Table.Cell>
          <DateCell>
            {this.state.cancellationDatePickerDisabled ? (
              <React.Fragment>
                {cancellationDate && (
                  <RowValue>{this.getFormattedDate(cancellationDate)}</RowValue>
                )}
                <Button onClick={e => this.toggleEdit(CANCELLATION_DATE)}>
                  Edit
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <DateInput
                  changeType={CANCELLATION_DATE}
                  changeHandler={this.dateChangeHandler}
                />
                <Button onClick={this.saveNewDate} primary>
                  Save
                </Button>
                <Button onClick={e => this.toggleEdit(CANCELLATION_DATE)}>
                  Close
                </Button>
              </React.Fragment>
            )}
          </DateCell>
        </Table.Row>
      </React.Fragment>
    );
  }
}

InsuranceTableRows.propTypes = {
  insurance: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  saveInsuranceDate: PropTypes.func.isRequired,
  sendCancelRequest: PropTypes.func.isRequired,
  sendCertificate: PropTypes.func.isRequired,
  changeCompanyStatus: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  activeDate: PropTypes.string,
  cancellationDate: PropTypes.string
};
