
import { Button, Card} from '@radix-ui/themes';

const WorkoutCard = ({ router }) => {

    const handleRedirect = () => {
        router.push("/workoutstats")
    }

    return (
        <Card className="p-6 flex flex-col items-center text-center m-6">
            <h2 className="text-xl font-bold">Workouts</h2>
            <p className="text-gray-500">Log your workouts and track performance.</p>
            <Button onClick={handleRedirect}>
            Add/View Workouts
            </Button>
        </Card>
    );
 };

export default WorkoutCard;
