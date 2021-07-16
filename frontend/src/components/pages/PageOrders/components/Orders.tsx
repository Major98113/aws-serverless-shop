import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import API_PATHS from "constants/apiPaths";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";

export default function Orders() {
  const [orders, setOrders] = useState<any>([]);

  console.log(orders);

  useEffect(() => {
    axios.get(`${API_PATHS.order}/orders`)
      .then(res => setOrders(res.data));
  }, []);

  const onDelete = (id: string) => {
    axios.delete(`${API_PATHS.order}/orders/${id}`)
      .then(() => {
        axios.get(`${API_PATHS.order}/orders`)
          .then(res => setOrders(res.data));
        }
      );
  };

  const reducer = ( acc: number, elem: any ) => acc + elem.count;


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell align="right">Items count</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell component="th" scope="row">
                {order.address?.firstname} {order.address?.lastname}
              </TableCell>
              <TableCell align="right">{order.items.products.reduce( reducer, 0 )}</TableCell>
              <TableCell align="right">{order.address?.address}</TableCell>
              <TableCell align="right">{order.items.status.toUpperCase()}</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary" component={Link} to={`/admin/orders/${order.items.order_id}`}>
                  Manage
                </Button>
                <Button size="small" color="secondary" onClick={() => onDelete(order.items.order_id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}