import { DcaCalculator } from '../components/dca/DcaCalculator';
import { MainHeader } from '../components/common/MainHeader';

export function DcaCalculatorPage() {
    return (
        <>
            <MainHeader title="Máy tính DCA" />
            <DcaCalculator />
        </>
    );
}
