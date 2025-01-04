
import { Button, Card} from '@radix-ui/themes';

const WorkoutCard = ({ router }) => {

    const handleRedirect = () => {
        router.push("/workoutstats")
    }

    return (
        <Card className="p-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold mb-4">Workouts</h2>
            <p className="text-gray-500 mb-4">Log your workouts and track performance.</p>
            <Button className='mt-auto' onClick={handleRedirect}>
            Add/View Workouts
            </Button>
        </Card>
    );
 };

export default WorkoutCard;
