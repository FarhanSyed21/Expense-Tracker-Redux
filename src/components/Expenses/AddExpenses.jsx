import React, { useEffect, useState } from "react";
import "./AddExpenses.css";
import { useSelector, useDispatch } from "react-redux";
import { listActions } from "../reduxStore/listData";
import ReactApexChart from "react-apexcharts";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

const AddExpenses = () => {
  const expenses = useSelector((state) => state.listData.expenses);
  const editingId = useSelector((state) => state.listData.editingId);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email).replace(/[@.]/g, "");

  const [money, setMoney] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [edit, setEdit] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("white");

  const [pieChartOptions, setPieChartOptions] = useState({
    chart: {
      width: 380,
      type: "pie"
    },
    labels: ["Food", "Petrol", "Salary", "Others"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  });

  const generatePieChartSeries = () => {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const { category, money } = expense;
      if (categoryTotals[category]) {
        categoryTotals[category] += parseFloat(money);
      } else {
        categoryTotals[category] = parseFloat(money);
      }
    });

    const series = pieChartOptions.labels.map(
      (label) => categoryTotals[label] || 0
    );
    return series;
  };

  useEffect(() => {
    fetch(
      `https://api-calls-70500-default-rtdb.firebaseio.com/expenses/${email}.json`,
      {
        method: "GET"
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .then((data) => {
        if (data === null) {
          return;
        } else {
          const expenseIds = Object.keys(data);
          const expenseValues = Object.values(data);
          for (let i = 0; i < expenseIds.length; i++) {
            dispatch(
              listActions.addExpense({
                expense: { ...expenseValues[i], id: expenseIds[i] }
              })
            );
          }
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [email, dispatch]);

  const calculateTotalExpenses = () => {
    let total = 0;
    expenses.forEach((expense) => {
      total += parseFloat(expense.money);
    });
    return total.toFixed(2);
  };

  const handleDeleteClick = async (expenseId) => {
    fetch(
      `https://api-calls-70500-default-rtdb.firebaseio.com/expenses/${email}/${expenseId}.json`,
      {
        method: "DELETE"
      }
    )
      .then((res) => {
        if (res.ok) {
          dispatch(listActions.removeExpense({ id: expenseId }));
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .catch((error) => {
        console.log("Error deleting expense:", error.message);
      });
  };

  const handleEditClick = (expense) => {
    dispatch(listActions.setEditingId(expense.id));
    setEdit(true);
    setMoney(expense.money);
    setDescription(expense.description);
    setCategory(expense.category);

    dispatch(listActions.removeExpense(expense.id));
  };

  const handleSaveClick = () => {
    const expenseData = {
      money,
      description,
      category
    };
    fetch(
      `https://api-calls-70500-default-rtdb.firebaseio.com/expenses/${email}.json`,
      {
        method: "POST",
        body: JSON.stringify(expenseData),
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .then((data) => {
        const newExpense = { ...expenseData, id: data.name };
        console.log(expenseData, data.name);
        dispatch(
          listActions.addExpense({
            expense: newExpense
          })
        );
        const updatedTotalExpenses =
          parseFloat(totalExpenses) + parseFloat(money);
        setTotalExpenses(updatedTotalExpenses.toFixed(2));
      })
      .catch((error) => {
        console.log(error.message);
      });

    setMoney("");
    setDescription("");
    setCategory("");
  };

  const handleSaveEditClick = () => {
    const Id = editingId;
    console.log("Editing ID:", Id);

    const expenseData = {
      money,
      description,
      category
    };
    console.log("Expense Data:", expenseData);

    fetch(
      `https://api-calls-70500-default-rtdb.firebaseio.com/expenses/${email}/${Id}.json`,
      {
        method: "PUT",
        body: JSON.stringify(expenseData)
      }
    )
      .then((res) => {
        if (res.ok) {
          dispatch(
            listActions.addExpense({ expense: { ...expenseData, id: Id } })
          );
          setMoney("");
          setDescription("");
          setCategory("");
          dispatch(listActions.clearEditingId());
          setEdit(false);

          toast.success("Please refresh the page to see changes.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
          });
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .catch((error) => {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      });

    const updatedTotalExpenses = parseFloat(totalExpenses) + parseFloat(money);
    setTotalExpenses(updatedTotalExpenses.toFixed(2));
  };

  useEffect(() => {
    const updatedTotalExpenses = calculateTotalExpenses();
    setTotalExpenses(updatedTotalExpenses);
  }, [expenses]);

  const handleBackgroundColorChange = () => {
    setBackgroundColor((prevColor) =>
      prevColor === "white" ? "gray" : "white"
    );
  };

  return (
    <>
      <Navbar />
      <div className="add-expenses-container" style={{ backgroundColor }}>
        <div className="expense-entry-from">
          <table className="expenses-table">
            <thead className="expenses-tableHead">
              <tr>
                <th>
                  <label htmlFor="money">Money</label>
                </th>
                <th>
                  <label htmlFor="description">Description</label>
                </th>
                <th>
                  <label htmlFor="category">Category</label>
                </th>
                {!edit && (
                  <th>
                    <button className="addExpenses" onClick={handleSaveClick}>
                      Add
                    </button>
                  </th>
                )}
                {edit && (
                  <th>
                    <button onClick={handleSaveEditClick}>Edit</button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="number"
                    name="money"
                    id="money"
                    value={money}
                    onChange={(e) => setMoney(e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </td>
                <td>
                  <select
                    name="category"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Food">Food</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Salary">Salary</option>
                    <option value="Others">Others</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          {totalExpenses >= 10000 ? (
            <div className="premium-expenses">
              <h1>Unlock Premium Features</h1>
              <p>Track your expenses like a pro with our Premium plan!</p>
              <ul>
                <li>Unlimited expense tracking</li>
                <li>Download your expenses</li>
              </ul>
              <p>Upgrade now and take control of your finances.</p>
              <button>
                <CSVLink
                  className="custom-csv-link"
                  data={expenses.map(({ id, ...rest }) => rest)}
                  filename={`expenses-${email}.csv`}
                  onClick={() => setExportData(expenses)}
                >
                  Upgrade to Premium
                </CSVLink>
              </button>
              <button
                className="background-button"
                onClick={handleBackgroundColorChange}
              >
                Change Background
              </button>
            </div>
          ) : null}
        </div>
        <div className="Expenses-Items">
          {expenses.length > 0 && (
            <div className="added-values">
              <h2>Added Expenses</h2>
              <table>
                <thead>
                  <tr>
                    <th>Money</th>
                    <th>Description</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr key={index}>
                      <td>₹{expense.money}</td>
                      <td>{expense.description}</td>
                      <td>{expense.category}</td>
                      <td>
                        <button
                          className="editBtn"
                          onClick={() => handleEditClick(expense)}
                        >
                          Edit
                        </button>

                        <button
                          className="delBtn"
                          onClick={() => handleDeleteClick(expense.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="expenses-total">
            <h3>Total Expenses</h3>
            <h1 style={{ color: totalExpenses >= 0 ? "green" : "red" }}>
              ₹{calculateTotalExpenses()}
            </h1>
          </div>
          <div className="expenses-pieChart">
            <h3>Expense Distribution</h3>
            <ReactApexChart
              options={pieChartOptions}
              series={generatePieChartSeries()}
              type="pie"
              width={380}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddExpenses;
