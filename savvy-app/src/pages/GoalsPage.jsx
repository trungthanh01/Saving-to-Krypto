import { Savvy } from '../components/savvy/Savvy';
import { SmartSuggestions } from '../components/portfolio/SmartSuggestions';

export function GoalsPage() {
    return (
        <>
            {/* Chúng ta sẽ cần sắp xếp lại các component này sau,
                bây giờ cứ đặt chúng vào đây trước. */}
            <SmartSuggestions />
            <Savvy />
        </>
    );
}
