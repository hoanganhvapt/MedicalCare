CREATE TABLE  admin_login (
	UserId int PRIMARY KEY IDENTITY (1,1),
  UserName varchar(50)  NOT NULL ,
  Password varchar(50)  NOT NULL ,
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.companydetails
CREATE TABLE  company_details (
  CompanyId int PRIMARY KEY IDENTITY (1,1),
  CompanyName varchar(50)  NOT NULL,
  Address varchar(150)   NULL,
  Phone varchar(20)   NULL,
  CompanyURL varchar(50)   NULL,
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.empregister
CREATE TABLE  emp_register (
  EmpNo int PRIMARY KEY IDENTITY (1,1),
  Designation varchar(50)   NULL,
  Joindate datetime  NULL,
  Salary double PRECISION NULL ,
  Firstname varchar(50)   NULL,
  Lastname varchar(50)   NULL,
  UserName varchar(50)   NULL,
  Password varchar(50)   NULL,
  Address varchar(150)   NULL,
  ContactNo varchar(50)   NULL,
  State varchar(50)   NULL,
  Country varchar(50)   NULL,
  City varchar(50)   NULL,
  PolicyStatus varchar(50)   NULL,
  PolicyId int  NULL,
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.hospitalinfo
CREATE TABLE  hospital_info (
  HospitalId int PRIMARY KEY IDENTITY (1,1),
  HospitalName varchar(50)   NULL,
  PhoneNo varchar(50)   NULL,
  Location varchar(50)   NULL,
  Url varchar(50)   NULL,
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.policies
CREATE TABLE  policies (
  PolicyId int  PRIMARY KEY IDENTITY (1,1),
  PolicyName double PRECISION NULL,
  PolicyDesc double PRECISION NULL,
  Amount double PRECISION NULL,
  Emi double PRECISION NULL,
  CompanyId int  NULL,
  MedicalId varchar(50)   NULL
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.policiesonemployees
CREATE TABLE  policies_on_employees (
PoEId int  PRIMARY KEY IDENTITY (1,1),
  EmpNo varchar(10)  NOT NULL,
  PolicyId int NOT NULL,
  PolicyName varchar(50)  NOT NULL,
  PolicyAmount double PRECISION NULL,
  PolicyDuration decimal(7,2) NOT NULL,
  Emi decimal(7,2) NOT NULL,
  PstarDate datetime NOT NULL,
  PendDate datetime NOT NULL,
  CompanyId varchar(30)   NULL,
  CompanyName varchar(50)  NOT NULL,
  Medical varchar(50)   NULL
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.policyapprovaldetails
CREATE TABLE  policy_approval_details (
  PolicyId int  PRIMARY KEY IDENTITY (1,1),
  RequestId int  NULL,
  Date datetime  NULL,
  Amount double PRECISION  NULL,
  Status char(3)   NULL,
  Reason varchar(50)   NULL
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.policyrequestdetails
CREATE TABLE  policy_request_details (
  RequestId int PRIMARY KEY IDENTITY (1,1),
  RequestDate datetime  NULL,
  Empno int  NULL,
  Policyname int  NULL,
  PolicyAmount double PRECISION NULL,
  Emi double PRECISION NULL,
  CompanyId int  NULL,
  CompanyName varchar(50)   NULL,
  Status varchar(50)   NULL
) 

-- Data exporting was unselected.

-- Dumping structure for table db_medical.policytotaldescription
CREATE TABLE  policy_total_description (
PTDId int  PRIMARY KEY IDENTITY (1,1),
  PolicyId int  NULL,
  PolicyName varchar(50)  NULL,
  PolicyDes varchar(250)  NULL,
  PolicyAmount double PRECISION NULL ,
  Emi double PRECISION NULL,
  PolicyDurationInMonth int NULL,
  CompanyName varchar(50)  NULL,
  MedicalId varchar(50)  NULL,
)