export function HoldingItem({coin}) {

    return (
        <tr>
            <td>{coin.name}</td>
            <td>{coin.current_price}</td>
            <td>{coin.price_change_percentage_24h}</td>
            <td>{coin.amount}</td>
            <td>{coin.amount * coin.current_price}</td>
            <td>... PNL...</td>
        </tr>
    )
}