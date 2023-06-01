import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData } from '../utils';
import { useMemo, useState } from 'react';

const studentsDataComponent = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  // memoized data
  const [studentsData, schoolsData, legalGuardiansData] = useMemo(() => {
    const studentsData = [];
    const schoolsData = {};
    const legalGuardiansData = {};

    // fetch data for all selected students in parallel
    const promises = selectedStudents.map(async (studentId) => {
      const { id, ...rest } = await fetchStudentData(studentId);
      studentsData.push({ id, ...rest }); // add student data

      if (!schoolsData[rest.schoolId]) {
        schoolsData[rest.schoolId] = await fetchSchoolData(rest.schoolId); // fetch school data if it doesn't exist
      }

      if (!legalGuardiansData[rest.legalguardianId]) {
        legalGuardiansData[rest.legalguardianId] = await fetchLegalguardianData(
          rest.legalguardianId
        ); // fetch legal guardian data if it doesn't exist
      }
    });

    Promise.all(promises).then(() => {
      // update the state once all the data is loaded
      setStudentsData([...studentsData]);
      setSchoolsData({ ...schoolsData });
      setLegalGuardiansData({ ...legalGuardiansData });
    });

    return [studentsData, schoolsData, legalGuardiansData];
  }, [selectedStudents]);

  const onStudentsPick = (studentIds) => {
    setSelectedStudents(studentIds);
  };

  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={studentsData}
        schoolsData={schoolsData}
        legalGuardiansData={legalGuardiansData}
      />
    </>
  );
};

export default studentsDataComponent;
