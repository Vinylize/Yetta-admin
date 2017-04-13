import csv from 'csv-string';
import React from 'react';
import moment from 'moment';

import { Link } from 'react-router';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionNoteAdd from 'material-ui/svg-icons/action/note-add';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import {
  refs,
} from '../../util/firebase';

import client from '../../util/lokka';


export default class NodeList extends React.Component {
  // static propTypes = {
  //   viewer: React.PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
    this.state = {
      createNodeModalOpen: false,
      bulkModalOpen: false,
      nodes: [],
      nodeCategory: {},
      c1: -1,
      c2: -1,
      c3: -1,
    };
  }

  componentDidMount() {
    this.initList();
  }

  componentWillUnmount() {

  }

  initList() {
    refs.node.root.orderByChild('createdAt').limitToLast(20).once('value', (data) => {
      if (data.val()) {
        this.setState({ nodes: Object.keys(data.val()).map(nodeKey => data.val()[nodeKey]) });
      }
    });

    refs.node.category.once('value', (data) => {
      if (data.val()) {
        this.setState({ nodeCategory: data.val() });
      }
    });
  }

  handleC1Change = (event, index, c1) => this.setState({ c1, c2: -1, c3: -1 });
  handleC2Change = (event, index, c2) => this.setState({ c2, c3: -1 });
  handleC3Change = (event, index, c3) => this.setState({ c3 });

  handleCreateNodeModalOpen = () => {
    this.setState({ createNodeModalOpen: true });
  };

  handleCreateNodeModalClose = () => {
    this.setState({ createNodeModalOpen: false });
  };

  handleCreateNodeModalCreate = () => {
    client.mutate(`{
     createNodeFromAdmin(
       input:{
         n: "${this.nameInput.getValue()}",
         p: "${this.phoneInput.getValue()}",
         addr: "${this.addressInput.getValue()}",
         c1: ${this.firstCategoryInput.getValue()},
         c2: ${this.secondCategoryInput.getValue()},
         type: "${this.typeInput.getValue()}",
         lat: ${this.latInput.getValue()}
         lon: ${this.lonInput.getValue()}
       }
     ) {
       result
     }
   }`
    )
      .then(() => {
        this.setState({ bulkModalOpen: false });
      })
      .catch(console.log);
  };

  handleCreateNodeFromBulkModalOpen = () => {
    this.setState({ bulkModalOpen: true });
  };

  handleCreateNodeFromBulkModalClose = () => {
    this.setState({ bulkModalOpen: false });
  };

  handleCreateNodeFromBulkModalCreate = () => {
    const p = [];
    csv.forEach(this.bulkInput.getValue(), ',', (row, index) => {
      if (index === 0) {
        this.header = row;
        return;
      }
      if (row.length === 1) {
        return;
      }

      p.push(new Promise((resolve, reject) => client.mutate(`{
        createNodeFromAdmin(
          input:{
            ${this.header[0]}: "${row[0]}",
            ${this.header[1]}: "${row[1]}",
            ${this.header[2]}: "${row[2]}",
            ${this.header[3]}: "${row[3]}",
            ${this.header[4]}: "${row[4]}",
            ${this.header[5]}: "${row[5]}",
            ${this.header[6]}: ${row[6]},
            ${this.header[7]}: ${row[7]},
            type: "non-partenerd"
          }
        ) {
            result
          }
        }`
        ).then(resolve)
          .catch(reject)));
    });
    Promise.all(p)
      .then(() => {
        this.initList();
        this.setState({ bulkModalOpen: false });
      })
      .catch(console.log);
  };

  renderSpinner() {
    if (this.state.isSearching) {
      return (<CircularProgress size={25} thickness={2} />);
    }
    return null;
  }

  render() {
    const createNodeModalActions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleCreateNodeModalClose}
      />,
      <FlatButton
        label='Create'
        primary
        onTouchTap={this.handleCreateNodeModalCreate}
      />,
    ];

    const createNodeFromBulkModalActions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleCreateNodeFromBulkModalClose}
      />,
      <FlatButton
        label='Create'
        primary
        onTouchTap={this.handleCreateNodeFromBulkModalCreate}
      />,
    ];

    return (
      <div>
        <div style={{ width: '100%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 40, alignItems: 'center' }} >
              <h3>List of Node</h3>
              <div style={{ display: 'flex', height: 56, flex: 1, justifyContent: 'flex-end', }}>
                <FloatingActionButton onClick={this.handleCreateNodeFromBulkModalOpen}>
                  <ActionNoteAdd name='addBulk' />
                </FloatingActionButton>
                <FloatingActionButton onClick={this.handleCreateNodeModalOpen}>
                  <ContentAdd name='add' />
                </FloatingActionButton>
              </div>
            </div>


            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}
              >
                {/* <TextField*/}
                {/* onChange={this.onSearchQueryChange.bind(this)}*/}
                {/* floatingLabelText='Search User by E-mail...'*/}
                {/* />*/}
                <div style={{ paddingLeft: 20, width: 40, height: 40 }}>
                  {this.renderSpinner()}
                </div>

              </div>
            </div>
            <div style={{ float: 'clear' }} >
              <div>
                <DropDownMenu
                  value={this.state.c1}
                  onChange={this.handleC1Change}
                  style={{ width: 200 }}
                  autoWidth={false}
                >
                  <MenuItem disabled key={'c1--1'} value={-1} primaryText={'Please select..'} />
                  {
                  Object.keys(this.state.nodeCategory).map(key =>
                    <MenuItem key={`c1-${key}`} value={key} primaryText={`${this.state.nodeCategory[key].name}`} />
                  )
                }
                </DropDownMenu>
                <DropDownMenu
                  value={this.state.c2}
                  onChange={this.handleC2Change}
                  style={{ width: 200 }}
                  autoWidth={false}
                >
                  <MenuItem disabled key={'c2--1'} value={-1} primaryText={'Please select..'} />
                  {
                  this.state.nodeCategory[this.state.c1] ? Object.keys(this.state.nodeCategory[this.state.c1].detail).map(key =>
                    <MenuItem key={`c2-${key}`} value={key} primaryText={`${this.state.nodeCategory[this.state.c1].detail[key].name}`} />
                  ) : null
                }
                </DropDownMenu>
                <FlatButton style={{ height: 50 }}label='Filter' primary />
              </div>

              {/* <DropDownMenu*/}
              {/* value={this.state.c3}*/}
              {/* onChange={this.handleC3Change}*/}
              {/* style={{ width: 200 }}*/}
              {/* autoWidth={false}*/}
              {/* >*/}
              {/* <MenuItem disabled key={'c3-1'} value={-1} primaryText={'Please select..'} />*/}
              {/* {*/}

              {/* this.state.nodeCategory[this.state.c1] ? Object.keys(this.state.nodeCategory[this.state.c1].detail).map(key =>*/}
              {/* <MenuItem key={`c3-${key}`} value={key} primaryText={`${this.state.nodeCategory[this.state.c1].detail[key].name}`} />*/}
              {/* ) : null*/}
              {/* }*/}
              {/* </DropDownMenu>*/}
              <Table
                selectable
                fixedHeader
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn colSpan='2'>image</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Address</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Phone</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>CreatedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.state.nodes.map((node) => {
                    const time = node.cAt ? moment(node.cAt).calendar() : 'N/A';
                    return (
                      <TableRow key={node.id}>
                        <TableRowColumn colSpan='2'><img width={50} role='presentation' src={node.imgUrl} /></TableRowColumn>
                        <TableRowColumn colSpan='2'>{node.name}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{node.addr}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{node.phone}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${time}`}</TableRowColumn>
                        <TableRowColumn colSpan='3'>
                          <Link to={`/node/${node.id}`}>
                            <RaisedButton label='Details' primary />
                          </Link>
                          {/* </RaisedButton>*/}
                        </TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table></div>

          </Paper>
          <Dialog
            title='Create Node'
            actions={createNodeModalActions}
            modal
            open={this.state.createNodeModalOpen}
            contentStyle={{ width: 400 }}
            onRequestClose={this.handleCreateNodeModalClose}
          >
            <Paper zDepth={0}>
              <TextField
                ref={(ref) => { this.nameInput = ref; }}
                hintText='Name'
                style={{ marginLeft: 20 }}
                underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.addressInput = ref; }}
                hintText='Address'
                style={{ marginLeft: 20 }}
                underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.phoneInput = ref; }}
                hintText='phone' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <TextField
                ref={(ref) => { this.firstCategoryInput = ref; }}
                hintText='Category 1' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.secondCategoryInput = ref; }}
                hintText='Category 2' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.typeInput = ref; }}
                hintText='Type' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.latInput = ref; }}
                hintText='Lat' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.lonInput = ref; }}
                hintText='Lng' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
            </Paper>
          </Dialog>
          <Dialog
            title='Create Node from bulk'
            actions={createNodeFromBulkModalActions}
            modal
            open={this.state.bulkModalOpen}
            contentStyle={{ width: 400 }}
            onRequestClose={this.handleCreateNodeFromBulkModalClose}
          >
            <Paper zDepth={0}>
              <TextField
                multiLine
                rowsMax={5}
                ref={(ref) => { this.bulkInput = ref; }}
                hintText='bulk text'
                style={{ marginLeft: 20 }}
                underlineShow={false}
              />
              <Divider />
            </Paper>
          </Dialog>
        </div>
      </div>
    );
  }
}
