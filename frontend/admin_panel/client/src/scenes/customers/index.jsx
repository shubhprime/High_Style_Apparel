import React from "react";
import { Box, useTheme } from "@mui/material";
import { useGetAllCustomersQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";

const Customers = () => {
    const theme = useTheme();
    const { data, isLoading } = useGetAllCustomersQuery();
    console.log("data", data);

    const columns = [
        {
            field: "_id",
            headerName: "ID",
            flex: 1,
        },
        {
            field: "firstName",
            headerName: "First Name",
            flex: 0.5,
        },
        {
            field: "lastName",
            headerName: "Last Name",
            flex: 0.5,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "phone",
            headerName: "Phone Number",
            flex: 0.5,
            renderCell: (params) => {
                const digits = params.value?.toString().replace(/\D/g, "") || "";
                if (digits.length === 10) {
                    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
                }
                return digits;
            },
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0.4,
            renderCell: (params) => {
                const { city = "", country = "" } = params.row.homeAddress || {};
                return [city, country].filter(Boolean).join(", ");
            },
        },
        {
            field: "verified",
            headerName: "Verified",
            flex: 1,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 0.5,
        },
    ];

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="CUSTOMERS" subtitle="List of Customers" />
            <Box
                mt="40px"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.background.alt,
                        color: theme.palette.secondary[100],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.primary.light,
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: theme.palette.background.alt,
                        color: theme.palette.secondary[100],
                        borderTop: "none",
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${theme.palette.secondary[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    loading={isLoading || !data}
                    getRowId={(row) => row._id}
                    rows={data?.data || []}
                    columns={columns}
                />
            </Box>
        </Box>
    );
};

export default Customers;