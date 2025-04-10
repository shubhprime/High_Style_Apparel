import React, { useState } from 'react'
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, Rating, useTheme, useMediaQuery } from '@mui/material';
import Header from "components/Header";
import { useGetAllProductsQuery } from 'state/api';

const Product = ({
    _id,
    productName,
    description,
    price,
    rating,
    category,
    stockQuantity,
    stat
}) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card
            sx={{
                backgroundImage: "none",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.55rem"
            }}
        >
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color={theme.palette.secondary[700]} gutterBottom>
                    {category}
                </Typography>
                <Typography variant="h5" component="div">
                    {productName}
                </Typography>
                <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
                    {`${price.currency} ${Number(price.amount).toFixed(2)}`}
                </Typography>
                <Rating value={rating} readOnly />

                <Typography variant="body2">{description}</Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="primary"
                    size="small"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    See More
                </Button>
            </CardActions>
            <Collapse
                in={isExpanded}
                timeout="auto"
                unmountOnExit
                sx={{
                    color: theme.palette.neutral[300],
                }}
            >
                <CardContent>
                    <Typography>id: {_id}</Typography>
                    <Typography>Supply Left: {stockQuantity}</Typography>
                    <Typography>
                        Yearly Sales This Year: {stat.yearlySalesTotal}
                    </Typography>
                    <Typography>
                        Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

const Products = () => {
    const { data, isLoading } = useGetAllProductsQuery();
    const products = data?.data || [];
    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (!products || products.length === 0) {
        return <Typography>No products available.</Typography>;
    }

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="PRODUCTS" subtitle="See your list of products" />
            {products || isLoading ? (
                <Box
                    mt="20px"
                    display="grid"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    justifyContent="space-between"
                    rowGap="20px"
                    columnGap="1.33%"
                    sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                    }}
                >
                    {products.map(({
                        _id,
                        productName,
                        description,
                        price,
                        rating,
                        category,
                        stockQuantity,
                        stat
                    }) => (
                        <Product
                            key={_id}
                            _id={_id}
                            productName={productName}
                            description={description}
                            price={price}
                            rating={rating}
                            category={category}
                            stockQuantity={stockQuantity}
                            stat={stat}
                        />
                    )
                    )}
                </Box>
            ) : (
                <>Loading...</>
            )}
        </Box>
    )
}

export default Products;
